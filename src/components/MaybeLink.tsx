import { Link } from "react-router-dom";
import type { LinkProps } from "react-router-dom";

import type { Url } from "/@/types/entity";

export interface PLinkProps extends Omit<LinkProps, "to"> {
    to?: Url | null;
}

export const MaybeLink = ({ to, children, ...props }: PLinkProps) => {
    if (!to) return children;

    return (
        <Link
            to={to}
            {...props}
        >
            children
        </Link>
    );
};
