import { AppWindow, BookOpen, Code2, GraduationCap, LayoutGrid, LayoutTemplate, Package, Sparkles, type LucideIcon } from "lucide-react";
import type { PRODUCT_TYPES } from "./types";
import courseImg from '../../assets/courses.png';
import sourceCodeImg from '../../assets/sourcecode.png';
import ebookImg from '../../assets/ebook.png';
import uiKitImg from '../../assets/uikit.png';
import templateImg from '../../assets/template.png';
import aiPromptImg from '../../assets/aiprompt.png';
import softwareImg from '../../assets/software.png';
import otherImg from '../../assets/other.png';

interface productMetaType {
    label: string;
    icon: LucideIcon;
    classname: string;
    thumbnail: string;
}

export const PRODUCT_META_TYPES: Record<PRODUCT_TYPES, productMetaType> = {
    course: {
        label: "Course",
        icon: GraduationCap,
        classname: "bg-indigo-500/10",
        thumbnail: courseImg,
    },
    "source-code": {
        label: "Source Code",
        icon: Code2,
        classname: "bg-cyan-500/10",
        thumbnail: sourceCodeImg,
    },
    ebook: {
        label: "Ebook",
        icon: BookOpen,
        classname: "bg-violet-500/10",
        thumbnail: ebookImg,
    },
    "ui-kit": {
        label: "UI Kit",
        icon: LayoutGrid,
        classname: "bg-fuchsia-500/10",
        thumbnail: uiKitImg,
    },
    template: {
        label: "Template",
        icon: LayoutTemplate,
        classname: "bg-blue-500/10",
        thumbnail: templateImg,
    },
    "ai-prompt": {
        label: "AI Prompt",
        icon: Sparkles,
        classname: "bg-purple-500/10",
        thumbnail: aiPromptImg,
    },
    software: {
        label: "Software",
        icon: AppWindow,
        classname: "bg-sky-500/10",
        thumbnail: softwareImg,
    },
    other: {
        label: "Other",
        icon: Package,
        classname: "bg-slate-500/10",
        thumbnail: otherImg,
    },
}

export const SIZE_CLASSES = {
    sm: { box: "h-9 w-9 rounded-md", icon: "h-4 w-4" },
    md: { box: "h-11 w-11 rounded-lg", icon: "h-5 w-5" },
    lg: { box: "h-16 w-16 rounded-xl", icon: "h-7 w-7" },
    xl: { box: "h-28 w-28 sm:h-32 sm:w-32 rounded-3xl", icon: "h-10 w-10" },
};

interface CategoryIconProps {
    type: PRODUCT_TYPES;
    size?: keyof typeof SIZE_CLASSES;
}

export const CategoryIcon = ({ type, size = "md" }: CategoryIconProps) => {
    const meta = PRODUCT_META_TYPES[type] ?? PRODUCT_META_TYPES.other;
    const Icon = meta.icon;
    const sizing = SIZE_CLASSES[size];

    return (
        <div className={`flex shrink-0 items-center justify-center ${meta.classname} ${sizing.box}`}>
            <Icon className={`${sizing.icon} text-indigo-200`}/>
        </div>
    )
}

interface categoryProps {
    type: PRODUCT_TYPES;
    size?: keyof typeof SIZE_CLASSES;
    showIconBadge?: boolean;
    className?: string;
    fill?: boolean;
}

export function CategoryThumbnail({
    type,
    size = "md",
    showIconBadge = false,
    className = "",
    fill = false
}: categoryProps) {
    const meta = PRODUCT_META_TYPES[type] ?? PRODUCT_META_TYPES.other;
    const Icon = meta.icon;
    const sizing = SIZE_CLASSES[size];
    const boxSizing = fill ? "h-full w-full" : `${sizing.box} shrink-0`;

    return (
        <div className={`relative overflow-hidden rounded-2xl border border-white/10 ${meta.classname} ${className} ${boxSizing}`}>
            <img className="absolute inset-0 h-full w-full object-cover" src={meta.thumbnail} alt={meta.label} />
            {showIconBadge && (
                <div className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-xl border border-white/15 bg-[#0b0d1f]/80 text-indigo-200 shadow-lg backdrop-blur-md">
                    <Icon className={SIZE_CLASSES[size].icon} />
                </div>
            )}
        </div>
    )
}