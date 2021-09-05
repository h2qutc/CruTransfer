import { FOLD_UPLOADS } from "../config";
import { Block, IBlock } from "../models";
import logger from "../services/log";
const path = require("path");

export class BlockService {
  private static instance: BlockService;

  constructor() {}

  public static getInstance(): BlockService {
    if (!BlockService.instance) {
      BlockService.instance = new BlockService();
    }
    return BlockService.instance;
  }

  /**
   * Choose block for pin file
   * @param fileSize
   * @param limit
   * @returns
   */
  chooseBlockForFile = async (
    file: any,
    limit: number
  ): Promise<{
    latest: IBlock;
    next: IBlock;
    isNew: boolean;
    pathToPin: string;
  }> => {
    const latest = await this.getLatestBlock();
    let next = latest,
      isNew = false;
    if (latest == null || latest.totalSize + file.size > limit) {
      next = await this.createNew();
      isNew = true;
    }
    const pathToPin = next != null ? this.factoryPathToPin(next, file) : "";
    return { latest, next, isNew, pathToPin };
  };

  /**
   * Get latest block
   * @returns
   */
  getLatestBlock = async () => {
    const list = await Block.find({}).limit(1).sort({ createdDate: "desc" });
    return list.length > 0 ? list[0] : null;
  };

  /**
   * Create new block
   * @returns
   */
  createNew = async () => {
    const latest = await this.getLatestBlock();

    const block = new Block();
    block.publicId = latest != null ? latest.publicId + 1 : 0;
    block.createdDate = new Date();
    return await block.save();
  };

  /**
   * Update block
   * @param dto
   * @returns
   */
  update = async (dto: IBlock) => {
    const block = await Block.findById(dto._id);

    if (block == null) {
      logger.error(`Block ${dto._id} not found`);
      return;
    }

    if (block != null) {
      block.totalSize = dto.totalSize;
      block.nbFiles = dto.nbFiles;
      block.pinnedDate = dto.pinnedDate;
      block.isPinnedToCrust = dto.isPinnedToCrust;
      block.cid = dto.cid;

      const saved = await block.save();
    }
  };

  /**
   * Delete block
   * @param block
   */
  delete = async (block: IBlock) => {
    await Block.deleteOne({ _id: block._id });
  };

  public factoryPathToPin = (block: IBlock, file?: any): string => {
    const folder = `${FOLD_UPLOADS}/block`;

    if (file != null) {
      const pathToFile = `${block.publicId}_${block.nbFiles}_${file.name}`;
      return path.resolve(
        process.cwd(),
        folder,
        block.publicId.toString(),
        pathToFile
      );
    } else {
      return path.resolve(process.cwd(), folder, block.publicId.toString());
    }
  };
}
