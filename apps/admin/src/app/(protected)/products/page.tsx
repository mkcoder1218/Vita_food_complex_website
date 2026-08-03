"use client";

import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, Package, Plus, Pencil, Trash2, X } from "lucide-react";
import ProductsPageCmsPanel from "./ProductsPageCmsPanel";
import {
  Ingredient,
  IngredientType,
  NutritionItem,
  NutritionUnit,
  ProductItem,
  ProductPayload,
  ProductUploadFiles,
  productsApi,
} from "@/lib/productsApi";

const inputCls =
  "w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#23B349]/35";

const tabBtn =
  "px-3 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0";

const NUTRITION_UNITS: NutritionUnit[] = ["g", "mg", "kcal", "%"];
const INGREDIENT_TYPES: { value: IngredientType | ""; label: string }[] = [
  { value: "", label: "Type (optional)" },
  { value: "main", label: "main" },
  { value: "additive", label: "additive" },
  { value: "allergen", label: "allergen" },
];

type TabId =
  | "basic"
  | "media"
  | "ui"
  | "content"
  | "nutrition"
  | "ingredients"
  | "certs"
  | "variations"
  | "related";

type ProductsAdminTab = "page" | "cards";

function emptyForm(): ProductPayload {
  return {
    slug: "",
    name: { en: "", am: "" },
    category: "Biscuit",
    media: { image: "", tagIcon: "" },
    ui: { bgColor: "#FFFFFF", textColor: "#333333", nameColor: "#333333" },
    content: {
      description: { en: "", am: "" },
      netWeight: "",
      nutrition: { servingSize: "", calories: 0, items: [] },
      ingredients: { list: [], contains: [], mayContain: [] },
      certifications: [],
    },
    colorVariations: [],
    relatedProducts: [],
    available: true,
  };
}

function itemToForm(item: ProductItem): ProductPayload {
  return {
    slug: item.slug,
    name: item.name,
    category: item.category,
    media: {
      image: item.media?.image ?? "",
      tagIcon: item.media?.tagIcon ?? "",
    },
    ui: item.ui,
    content: {
      description: item.content?.description ?? { en: "", am: "" },
      netWeight: item.content?.netWeight ?? "",
      nutrition: item.content?.nutrition ?? {
        servingSize: "",
        calories: 0,
        items: [],
      },
      ingredients: {
        list: item.content?.ingredients?.list ?? [],
        contains: item.content?.ingredients?.contains ?? [],
        mayContain: item.content?.ingredients?.mayContain ?? [],
      },
      certifications: item.content?.certifications ?? [],
    },
    colorVariations: item.colorVariations ?? [],
    relatedProducts: item.relatedProducts ?? [],
    available: item.available ?? true,
  };
}

function containsToString(arr: string[] | undefined): string {
  return (arr ?? []).join(", ");
}

function parseCommaList(s: string): string[] {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function emptyUploadFiles(): ProductUploadFiles {
  return {
    imageFile: null,
    tagIconFile: null,
    certificationFiles: [],
  };
}

function resolvePreviewUrl(file: File | null | undefined, fallback?: string): string {
  if (file) return URL.createObjectURL(file);
  return fallback ?? "";
}

function formatDate(value?: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
}

function ProductModal({
  title,
  value,
  files,
  productOptions,
  onChange,
  onFilesChange,
  onClose,
  onSubmit,
  submitting,
}: {
  title: string;
  value: ProductPayload;
  files: ProductUploadFiles;
  productOptions: Array<{ id: string; label: string }>;
  onChange: (next: ProductPayload) => void;
  onFilesChange: (next: ProductUploadFiles) => void;
  onClose: () => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const [tab, setTab] = useState<TabId>("basic");
  const imagePreview = useMemo(
    () => resolvePreviewUrl(files.imageFile, value.media.image),
    [files.imageFile, value.media.image],
  );
  const tagIconPreview = useMemo(
    () => resolvePreviewUrl(files.tagIconFile, value.media.tagIcon),
    [files.tagIconFile, value.media.tagIcon],
  );

  const setContent = (patch: Partial<ProductPayload["content"]>) => {
    onChange({ ...value, content: { ...value.content, ...patch } });
  };

  const nutrition = value.content.nutrition ?? {
    servingSize: "",
    calories: 0,
    items: [] as NutritionItem[],
  };
  const setNutrition = (patch: Partial<typeof nutrition>) => {
    setContent({ nutrition: { ...nutrition, ...patch } });
  };

  const ingredients = value.content.ingredients ?? {
    list: [] as Ingredient[],
    contains: [] as string[],
    mayContain: [] as string[],
  };
  const setIngredients = (patch: Partial<typeof ingredients>) => {
    setContent({ ingredients: { ...ingredients, ...patch } });
  };

  const certifications = value.content.certifications ?? [];

  const tabs: { id: TabId; label: string }[] = [
    { id: "basic", label: "Basic" },
    { id: "media", label: "Media" },
    { id: "ui", label: "UI" },
    { id: "content", label: "Content" },
    { id: "nutrition", label: "Nutrition" },
    { id: "ingredients", label: "Ingredients" },
    { id: "certs", label: "Certifications" },
    { id: "variations", label: "Variations" },
    { id: "related", label: "Related" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white z-10 flex flex-col shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <h3 className="font-['Funnel_Display'] text-lg font-bold text-[#333733]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <X size={14} />
          </button>
        </div>

        <div className="px-5 pt-3 flex gap-1.5 flex-wrap border-b border-gray-50 shrink-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`${tabBtn} ${
                tab === t.id
                  ? "bg-[#23B349] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5 overflow-y-auto flex-1 min-h-0 space-y-4">
          {tab === "basic" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#333733] mb-1">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputCls}
                  placeholder="e.g. zoo"
                  value={value.slug}
                  onChange={(e) => onChange({ ...value, slug: e.target.value })}
                />
                <p className="text-xs text-gray-400 mt-1">URL-safe: letters, numbers, hyphens.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#333733] mb-1">
                  Name (EN) <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputCls}
                  value={value.name.en}
                  onChange={(e) => onChange({ ...value, name: { ...value.name, en: e.target.value } })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#333733] mb-1">
                  Name (AM) <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputCls}
                  value={value.name.am}
                  onChange={(e) => onChange({ ...value, name: { ...value.name, am: e.target.value } })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#333733] mb-1">Category</label>
                <select
                  className={inputCls}
                  value={value.category}
                  onChange={(e) =>
                    onChange({ ...value, category: e.target.value as ProductPayload["category"] })
                  }
                >
                  <option value="Biscuit">Biscuit</option>
                  <option value="Flour">Flour</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#333733] md:col-span-2">
                <input
                  type="checkbox"
                  checked={value.available ?? true}
                  onChange={(e) => onChange({ ...value, available: e.target.checked })}
                />
                Available
              </label>
            </div>
          )}

          {tab === "media" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#333733] mb-1">
                  Product image file <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className={inputCls}
                  onChange={(e) =>
                    onFilesChange({
                      ...files,
                      imageFile: e.target.files?.[0] ?? null,
                    })
                  }
                />
                {imagePreview ? (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    />
                    <p className="text-xs text-gray-500">
                      {files.imageFile ? `Selected: ${files.imageFile.name}` : "Using current image"}
                    </p>
                  </div>
                ) : null}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#333733] mb-1">
                  Tag icon file (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className={inputCls}
                  onChange={(e) =>
                    onFilesChange({
                      ...files,
                      tagIconFile: e.target.files?.[0] ?? null,
                    })
                  }
                />
                {tagIconPreview ? (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={tagIconPreview}
                      alt="Tag icon preview"
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    />
                    <p className="text-xs text-gray-500">
                      {files.tagIconFile ? `Selected: ${files.tagIconFile.name}` : "Using current tag icon"}
                    </p>
                  </div>
                ) : null}
                {value.media.tagIcon ? (
                  <button
                    type="button"
                    className="mt-2 text-xs text-red-500 hover:underline"
                    onClick={() =>
                      onChange({
                        ...value,
                        media: { ...value.media, tagIcon: undefined },
                      })
                    }
                  >
                    Remove current tag icon
                  </button>
                ) : null}
              </div>
            </div>
          )}

          {tab === "ui" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#333733] mb-1">Background</label>
                <input
                  className={inputCls}
                  placeholder="#hex or CSS gradient"
                  value={value.ui.bgColor}
                  onChange={(e) => onChange({ ...value, ui: { ...value.ui, bgColor: e.target.value } })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#333733] mb-1">Text color</label>
                <input
                  className={inputCls}
                  value={value.ui.textColor}
                  onChange={(e) => onChange({ ...value, ui: { ...value.ui, textColor: e.target.value } })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#333733] mb-1">Name color</label>
                <input
                  className={inputCls}
                  value={value.ui.nameColor}
                  onChange={(e) => onChange({ ...value, ui: { ...value.ui, nameColor: e.target.value } })}
                />
              </div>
            </div>
          )}

          {tab === "content" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#333733] mb-1">
                  Description (EN) <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={`${inputCls} min-h-[80px]`}
                  value={value.content.description.en}
                  onChange={(e) =>
                    setContent({
                      description: { ...value.content.description, en: e.target.value },
                    })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#333733] mb-1">
                  Description (AM) <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={`${inputCls} min-h-[80px]`}
                  value={value.content.description.am}
                  onChange={(e) =>
                    setContent({
                      description: { ...value.content.description, am: e.target.value },
                    })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#333733] mb-1">Net weight</label>
                {value.category?.toLowerCase() === 'flour' ? (
                  <select
                    className={inputCls}
                    value={value.content.netWeight ?? ""}
                    onChange={(e) => setContent({ netWeight: e.target.value })}
                  >
                    <option value="">Select weight</option>
                    <option value="5kg">5kg</option>
                    <option value="10kg">10kg</option>
                    <option value="15kg">15kg</option>
                    <option value="25kg">25kg</option>
                    <option value="50kg">50kg</option>
                  </select>
                ) : (
                  <input
                    className={inputCls}
                    placeholder="e.g. 120g"
                    value={value.content.netWeight ?? ""}
                    onChange={(e) => setContent({ netWeight: e.target.value })}
                  />
                )}
              </div>
            </div>
          )}

          {tab === "nutrition" && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#333733] mb-1">Serving size</label>
                  {value.category?.toLowerCase() === 'flour' ? (
                    <select
                      className={inputCls}
                      value={nutrition.servingSize}
                      onChange={(e) => setNutrition({ servingSize: e.target.value })}
                    >
                      <option value="">Select serving size</option>
                      <option value="Per 100g">Per 100g</option>
                      <option value="5kg">5kg</option>
                      <option value="10kg">10kg</option>
                      <option value="15kg">15kg</option>
                      <option value="25kg">25kg</option>
                      <option value="50kg">50kg</option>
                    </select>
                  ) : (
                    <input
                      className={inputCls}
                      value={nutrition.servingSize}
                      onChange={(e) => setNutrition({ servingSize: e.target.value })}
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#333733] mb-1">Calories</label>
                  <input
                    type="number"
                    className={inputCls}
                    value={nutrition.calories}
                    onChange={(e) => setNutrition({ calories: Number(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#333733]">Nutrition items</span>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#23B349] px-2 py-1 rounded-lg bg-emerald-50"
                  onClick={() =>
                    setNutrition({
                      items: [...nutrition.items, { name: "", value: 0, unit: "g" }],
                    })
                  }
                >
                  + Add row
                </button>
              </div>
              <div className="space-y-2">
                {nutrition.items.map((row, idx) => (
                  <div key={idx} className="flex flex-wrap gap-2 items-end p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <input
                      className={`${inputCls} flex-1 min-w-[120px]`}
                      placeholder="Name"
                      value={row.name}
                      onChange={(e) => {
                        const items = [...nutrition.items];
                        items[idx] = { ...row, name: e.target.value };
                        setNutrition({ items });
                      }}
                    />
                    <input
                      type="number"
                      className={`${inputCls} w-24`}
                      placeholder="Value"
                      value={row.value}
                      onChange={(e) => {
                        const items = [...nutrition.items];
                        items[idx] = { ...row, value: Number(e.target.value) || 0 };
                        setNutrition({ items });
                      }}
                    />
                    <select
                      className={`${inputCls} w-28`}
                      value={row.unit}
                      onChange={(e) => {
                        const items = [...nutrition.items];
                        items[idx] = { ...row, unit: e.target.value as NutritionUnit };
                        setNutrition({ items });
                      }}
                    >
                      {NUTRITION_UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      className={`${inputCls} w-24`}
                      placeholder="% DV"
                      value={row.dailyValue ?? ""}
                      onChange={(e) => {
                        const items = [...nutrition.items];
                        const v = e.target.value;
                        items[idx] = {
                          ...row,
                          dailyValue: v === "" ? undefined : Number(v),
                        };
                        setNutrition({ items });
                      }}
                    />
                    <button
                      type="button"
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                      onClick={() =>
                        setNutrition({
                          items: nutrition.items.filter((_, i) => i !== idx),
                        })
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "ingredients" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#333733]">Ingredient list</span>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#23B349] px-2 py-1 rounded-lg bg-emerald-50"
                  onClick={() =>
                    setIngredients({
                      list: [...ingredients.list, { name: "" }],
                    })
                  }
                >
                  + Add ingredient
                </button>
              </div>
              <div className="space-y-2">
                {ingredients.list.map((row, idx) => (
                  <div key={idx} className="flex flex-wrap gap-2 items-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <input
                      className={`${inputCls} flex-1 min-w-[140px]`}
                      placeholder="Name"
                      value={row.name}
                      onChange={(e) => {
                        const list = [...ingredients.list];
                        list[idx] = { ...row, name: e.target.value };
                        setIngredients({ list });
                      }}
                    />
                    <select
                      className={`${inputCls} w-40`}
                      value={row.type ?? ""}
                      onChange={(e) => {
                        const list = [...ingredients.list];
                        const v = e.target.value as IngredientType | "";
                        list[idx] = {
                          ...row,
                          type: v === "" ? undefined : v,
                        };
                        setIngredients({ list });
                      }}
                    >
                      {INGREDIENT_TYPES.map((o) => (
                        <option key={o.label} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                      onClick={() =>
                        setIngredients({
                          list: ingredients.list.filter((_, i) => i !== idx),
                        })
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#333733] mb-1">Contains (comma-separated)</label>
                <input
                  className={inputCls}
                  value={containsToString(ingredients.contains)}
                  onChange={(e) => setIngredients({ contains: parseCommaList(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#333733] mb-1">May contain (comma-separated)</label>
                <input
                  className={inputCls}
                  value={containsToString(ingredients.mayContain)}
                  onChange={(e) => setIngredients({ mayContain: parseCommaList(e.target.value) })}
                />
              </div>
            </div>
          )}

          {tab === "certs" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#333733]">Certifications</span>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#23B349] px-2 py-1 rounded-lg bg-emerald-50"
                  onClick={() =>
                    setContent({
                      certifications: [...certifications, { name: "", image: "" }],
                    })
                  }
                >
                  + Add certification
                </button>
              </div>
              {certifications.map((row, idx) => (
                <div key={idx} className="flex flex-wrap gap-2 items-start p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <input
                    className={`${inputCls} flex-1 min-w-[120px]`}
                    placeholder="Name"
                    value={row.name}
                    onChange={(e) => {
                      const next = [...certifications];
                      next[idx] = { ...row, name: e.target.value };
                      setContent({ certifications: next });
                    }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className={`${inputCls} flex-1 min-w-[180px]`}
                    onChange={(e) => {
                      const nextCertFiles = [...(files.certificationFiles ?? [])];
                      nextCertFiles[idx] = e.target.files?.[0] ?? null;
                      onFilesChange({
                        ...files,
                        certificationFiles: nextCertFiles,
                      });
                    }}
                  />
                  {(files.certificationFiles?.[idx] || row.image) && (
                    <div className="w-full flex items-center gap-3">
                      <img
                        src={resolvePreviewUrl(files.certificationFiles?.[idx] ?? null, row.image)}
                        alt={`${row.name || "Certification"} preview`}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      />
                      <p className="text-xs text-gray-500">
                        {files.certificationFiles?.[idx]
                          ? `Selected: ${files.certificationFiles[idx]?.name ?? "image"}`
                          : "Using current certification image"}
                      </p>
                    </div>
                  )}
                  <button
                    type="button"
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                    onClick={() => {
                      setContent({
                        certifications: certifications.filter((_, i) => i !== idx),
                      });
                      const nextCertFiles = [...(files.certificationFiles ?? [])];
                      nextCertFiles.splice(idx, 1);
                      onFilesChange({
                        ...files,
                        certificationFiles: nextCertFiles,
                      });
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === "variations" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#333733]">Color Variations</span>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#23B349] px-2 py-1 rounded-lg bg-emerald-50"
                  onClick={() =>
                    onChange({
                      ...value,
                      colorVariations: [...(value.colorVariations ?? []), { colorCode: "", bgColor: "" }],
                    })
                  }
                >
                  + Add variation
                </button>
              </div>
              {(value.colorVariations ?? []).map((row, idx) => (
                <div key={idx} className="flex flex-wrap gap-2 items-start p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex-1 space-y-2 min-w-[200px]">
                    <input
                      className={`${inputCls}`}
                      placeholder="Dot Color (Hex or CSS)"
                      value={row.colorCode}
                      onChange={(e) => {
                        const next = [...(value.colorVariations ?? [])];
                        next[idx] = { ...row, colorCode: e.target.value };
                        onChange({ ...value, colorVariations: next });
                      }}
                    />
                    <input
                      className={`${inputCls}`}
                      placeholder="Background Color (Hex or Gradient)"
                      value={row.bgColor}
                      onChange={(e) => {
                        const next = [...(value.colorVariations ?? [])];
                        next[idx] = { ...row, bgColor: e.target.value };
                        onChange({ ...value, colorVariations: next });
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                    onClick={() => {
                      const next = [...(value.colorVariations ?? [])];
                      next.splice(idx, 1);
                      onChange({ ...value, colorVariations: next });
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === "related" && (
            <div>
              <label className="block text-xs font-semibold text-[#333733] mb-1">
                Related products
              </label>
              <select
                multiple
                className={`${inputCls} min-h-[150px]`}
                value={value.relatedProducts ?? []}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map(
                    (option) => option.value,
                  );
                  onChange({ ...value, relatedProducts: selected });
                }}
              >
                {productOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Hold Ctrl/Cmd to select multiple products.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-5 border-t border-gray-100 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm">
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className="px-4 py-2.5 rounded-xl text-sm text-white bg-[#23B349] disabled:opacity-70"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function resolveItemKey(item: ProductItem): string {
  return item.slug;
}

function resolveProductId(item: ProductItem): string {
  return item._id;
}

export default function ProductsPage() {
  const [adminTab, setAdminTab] = useState<ProductsAdminTab>("cards");
  const [items, setItems] = useState<ProductItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [form, setForm] = useState<ProductPayload>(() => emptyForm());
  const [uploadFiles, setUploadFiles] = useState<ProductUploadFiles>(() =>
    emptyUploadFiles(),
  );
  const [editing, setEditing] = useState<ProductItem | null>(null);
  const [open, setOpen] = useState(false);
  const productOptions = items
    .map((item) => ({
      id: resolveProductId(item),
      label: `${item.name.en} (${item.slug})`,
    }))
    .filter((option) => option.id !== editing?._id);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const loaded = await productsApi.list();
      setItems(loaded);
      setSelectedIds((prev) => prev.filter((id) => loaded.some((item) => item._id === id)));
    } catch (error) {
      console.error(error);
      setLoadError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setUploadFiles(emptyUploadFiles());
    setOpen(true);
  };

  const openEdit = (item: ProductItem) => {
    setEditing(item);
    setForm(itemToForm(item));
    setUploadFiles(emptyUploadFiles());
    setOpen(true);
  };

  const submit = async () => {
    if (!form.slug.trim()) {
      window.alert("Slug is required.");
      return;
    }
    if (!form.name.en.trim() || !form.name.am.trim()) {
      window.alert("Name (EN) and Name (AM) are required.");
      return;
    }
    if (!editing && !uploadFiles.imageFile) {
      window.alert("Product image file is required.");
      return;
    }
    if (!form.content.description.en.trim() || !form.content.description.am.trim()) {
      window.alert("Description (EN) and (AM) are required.");
      return;
    }

    setSubmitting(true);
    try {
      if (editing) {
        await productsApi.update(editing._id, form, uploadFiles);
      } else {
        await productsApi.create(form, uploadFiles);
      }
      setOpen(false);
      setUploadFiles(emptyUploadFiles());
      await load();
    } catch (error) {
      console.error(error);
      window.alert("Failed to save product. Please check your input and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (item: ProductItem) => {
    if (!window.confirm(`Delete product "${item.name.en}"?`)) {
      return;
    }
    try {
      await productsApi.remove(resolveItemKey(item));
      await load();
    } catch (error) {
      console.error(error);
      window.alert("Failed to delete product.");
    }
  };

  const toggleSelection = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? Array.from(new Set([...prev, id])) : prev.filter((v) => v !== id),
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(items.map((item) => item._id));
      return;
    }
    setSelectedIds([]);
  };

  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected products?`)) {
      return;
    }

    try {
      await Promise.all(
        items
          .filter((item) => selectedIds.includes(item._id))
          .map((item) => productsApi.remove(item._id)),
      );
      setSelectedIds([]);
      await load();
    } catch (error) {
      console.error(error);
      window.alert("Failed to delete one or more selected products.");
    }
  };

  const tabBtn = (
    id: ProductsAdminTab,
    label: string,
    Icon: typeof LayoutGrid,
  ) => (
    <button
      type="button"
      key={id}
      onClick={() => setAdminTab(id)}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
        adminTab === id
          ? "bg-[#23B349] text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <>
      <header className="min-h-[68px] bg-white border-b border-gray-100 px-4 lg:px-8 py-3 lg:py-0 lg:flex lg:items-center lg:justify-between sticky top-0 z-10 gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <h1 className="font-['Funnel_Display'] text-lg font-bold text-[#333733] shrink-0">
            Products
          </h1>
          <div className="flex flex-wrap gap-2">
            {tabBtn("page", "Page content", LayoutGrid)}
            {tabBtn("cards", "Product cards", Package)}
          </div>
        </div>
        {adminTab === "cards" && (
          <div className="flex items-center gap-2 mt-3 lg:mt-0">
            <button
              type="button"
              onClick={deleteSelected}
              disabled={selectedIds.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-50 text-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 size={14} /> Delete ({selectedIds.length})
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white bg-[#23B349] text-sm font-semibold"
            >
              <Plus size={14} /> Add Product
            </button>
          </div>
        )}
      </header>
      {adminTab === "page" && (
        <div className="p-4 sm:p-6 lg:p-8">
          <ProductsPageCmsPanel />
        </div>
      )}
      {adminTab === "cards" && (
      <div className="p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#23B349]" />
          </div>
        ) : loadError ? (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between">
            <p className="text-sm text-red-700">{loadError}</p>
            <button
              onClick={load}
              className="px-3 py-1.5 text-xs rounded-lg bg-white border border-red-200 text-red-700"
            >
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
            <Package className="mx-auto text-gray-300 mb-3" size={28} />
            <h3 className="text-sm font-semibold text-[#333733]">No products yet</h3>
            <p className="text-xs text-gray-500 mt-1">Create your first product to get started.</p>
            <button
              onClick={openCreate}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-[#23B349] text-sm font-semibold"
            >
              <Plus size={14} /> Add Product
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full min-w-[980px]">
              <thead className="border-b border-gray-100">
                <tr>
                  {["", "Product", "Visual", "Category", "Details", "Status", "Updated", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs uppercase tracking-wide text-gray-400 px-5 py-4">
                      {h || (
                        <input
                          type="checkbox"
                          checked={items.length > 0 && selectedIds.length === items.length}
                          onChange={(e) => toggleSelectAll(e.target.checked)}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-b border-gray-50">
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item._id)}
                        onChange={(e) => toggleSelection(item._id, e.target.checked)}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center">
                          {item.media?.image ? (
                            <img src={item.media.image} alt={item.name.en} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={16} className="text-[#23B349]" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#333733]">{item.name.en}</p>
                          <p className="text-xs text-gray-500">{item.name.am}</p>
                          <p className="text-xs text-gray-400">{resolveItemKey(item)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.media?.image || ""}
                          alt={`${item.name.en} visual`}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                        />
                        {item.media?.tagIcon ? (
                          <img
                            src={item.media.tagIcon}
                            alt={`${item.name.en} tag`}
                            className="w-8 h-8 rounded-md object-cover border border-gray-100"
                          />
                        ) : (
                          <span className="text-[11px] text-gray-400">No tag</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{item.category}</td>
                    <td className="px-5 py-4">
                      <div className="space-y-1 text-xs text-gray-500">
                        <p>Nutrition: {item.content?.nutrition?.items?.length ?? 0} items</p>
                        <p>Ingredients: {item.content?.ingredients?.list?.length ?? 0} items</p>
                        <p>Certs: {item.content?.certifications?.length ?? 0}</p>
                        <p>Related: {item.relatedProducts?.length ?? 0}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.available
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500">{formatDate(item.updatedAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => remove(item)}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {open && (
        <ProductModal
          title={editing ? "Edit Product" : "Add Product"}
          value={form}
          files={uploadFiles}
          productOptions={productOptions}
          onChange={setForm}
          onFilesChange={setUploadFiles}
          onClose={() => setOpen(false)}
          onSubmit={submit}
          submitting={submitting}
        />
      )}
    </>
  );
}
