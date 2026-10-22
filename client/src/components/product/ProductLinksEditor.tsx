import { Link2, Plus, Trash } from "lucide-react";
import type { ProductLinkItem } from "./types"
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface ProductLinksProps {
    links: ProductLinkItem[];
    onChange: (links: ProductLinkItem[]) => void;
}

const ProductLinksEditor = ({
    links,
    onChange
}: ProductLinksProps) => {

    const addLinks = () => onChange([...links, { title: "", url: "" }]);

    const removeLink = (index: number) => onChange(links.filter((_, i) => i !== index));

    const updateLink = (index: number, key: keyof ProductLinkItem, value: string) => {
        const updateLinks = [...links];
        updateLinks[index] = { ...updateLinks[index], [key]: value };
        onChange(updateLinks);
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <Link2 className="size-5 text-indigo-300" />
                    <h2 className="text-base font-semibold tracking-wide text-white">Product Links</h2>
                </div>

                <button
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-indigo-400/25 bg-indigo-500/10 px-3 py-2 text-sm font-medium text-indigo-200 transition hover:border-indigo-400/50 hover:bg-indigo-500/20 hover:text-white"
                    onClick={addLinks}
                    type="button"
                >
                    <Plus className="size-4" />
                    <span className="hidden sm:inline">Add Link</span>
                    <span className="sm:hidden">Add</span>
                </button>
            </div>

            {links.length === 0 && (
                <p className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-5 text-sm leading-6 text-slate-500">No links added yet. Add documentation, demo, or support links for customers.</p>
            )}

            <div className="space-y-3">
                {links.map((link, index) => (
                    <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.025] p-3 sm:p-4" key={index}>
                        <Input
                            className="h-11 rounded-xl border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500 focus-visible:border-indigo-400/60 focus-visible:ring-indigo-400/20"
                            value={link.title}
                            onChange={(e) => updateLink(index, "title", e.target.value)}
                            placeholder="Link Title (e.g. Documentation)"
                        />

                        <div className="flex min-w-0 items-center gap-2">
                            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 focus-within:border-indigo-400/60 focus-within:ring-2 focus-within:ring-indigo-400/20">
                                <Link2 className="size-4 shrink-0 text-slate-500" />
                                <Input
                                    className="h-11 min-w-0 border-0 bg-transparent px-0 text-white shadow-none placeholder:text-slate-500 focus-visible:border-transparent focus-visible:ring-0"
                                    value={link.url}
                                    onChange={(e) => updateLink(index, "url", e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>

                            <Button
                                className="size-11 shrink-0 rounded-xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-300"
                                onClick={() => removeLink(index)}
                                size="icon"
                                type="button"
                                variant="ghost"
                            >
                                <Trash />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProductLinksEditor