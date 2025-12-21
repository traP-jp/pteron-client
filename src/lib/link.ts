import type { Url } from "/@/types/entity";

export const createExternalLinkHandler = (href: Url) => {
    const handleExternalLinkClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (href) window.open(href, "_blank", "noopener,noreferrer");
    };

    return handleExternalLinkClick;
};
