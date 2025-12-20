export type BrandedType<T, Brand> = T & {
    readonly __brand: Brand;
};

export type BaseType<T> = Omit<T, "__brand">;

export const toBranded = <T>(value: BaseType<T>): T => value as T;

export type UserName = BrandedType<string, "UserName">;
export type UserId = BrandedType<string, "UserId">;

export type ProjectName = BrandedType<string, "ProjectName">;
export type ProjectId = BrandedType<string, "ProjectId">;

export type Url = BrandedType<string, "Url">;
export type Copia = BrandedType<bigint, "Copia">;
