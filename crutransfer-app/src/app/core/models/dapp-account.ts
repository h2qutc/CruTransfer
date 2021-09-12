export interface IDappAccount {
    address: string;
    meta: IDappAccountMeta
}

export interface IDappAccountMeta {
    genesisHash: string;
    name: string;
    source: string;
}