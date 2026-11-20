import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/admin/AdminPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add upload state variables if not present
if (!content.includes('isUploadingProductImg')) {
  content = content.replace(
    '  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);',
    `  const [isUploadingProductImg, setIsUploadingProductImg] = useState(false);
  const [isUploadingCategoryImg, setIsUploadingCategoryImg] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);`
  );
}

// 2. Add handleProductImageFileChange and handleCategoryImageFileChange handlers
const uploadHandlers = `
  // ==================== CLOUDINARY IMAGE UPLOAD HANDLERS ====================
  const handleProductImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (onShowToast) onShowToast('Please select a valid image file (PNG, JPG, WEBP)', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      if (onShowToast) onShowToast('Image size exceeds 10MB limit', 'error');
      return;
    }

    setIsUploadingProductImg(true);
    try {
      const result = await uploadImageApi(file, 'madhusri_products');
      if (result && result.url) {
        setProductForm(prev => ({ ...prev, image: result.url }));
        if (onShowToast) {
          onShowToast(
            result.provider === 'cloudinary' 
              ? 'Product image uploaded to Cloudinary!' 
              : 'Product image uploaded successfully!', 
            'success'
          );
        }
      }
    } catch (err) {
      if (onShowToast) onShowToast('Failed to upload image: ' + err.message, 'error');
    } finally {
      setIsUploadingProductImg(false);
    }
  };

  const handleCategoryImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (onShowToast) onShowToast('Please select a valid image file', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      if (onShowToast) onShowToast('Image size exceeds 10MB limit', 'error');
      return;
    }

    setIsUploadingCategoryImg(true);
    try {
      const result = await uploadImageApi(file, 'madhusri_categories');
      if (result && result.url) {
        setCategoryForm(prev => ({ ...prev, image: result.url }));
        if (onShowToast) {
          onShowToast(
            result.provider === 'cloudinary' 
              ? 'Category image uploaded to Cloudinary!' 
              : 'Category image uploaded successfully!', 
            'success'
          );
        }
      }
    } catch (err) {
      if (onShowToast) onShowToast('Failed to upload image: ' + err.message, 'error');
    } finally {
      setIsUploadingCategoryImg(false);
    }
  };
`;

if (!content.includes('handleProductImageFileChange')) {
  content = content.replace(
    '  // ==================== PRODUCT HANDLERS ====================',
    `${uploadHandlers}\n  // ==================== PRODUCT HANDLERS ====================`
  );
}

// 3. Update Product Modal Photo Upload Component
const productUploadUI = `              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Image (Cloudinary Upload)
                </label>

                {/* Upload Zone */}
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 hover:border-red-400 rounded-2xl p-4 transition text-center relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageFileChange}
                    disabled={isUploadingProductImg}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  {isUploadingProductImg ? (
                    <div className="py-4 flex flex-col items-center justify-center text-red-600 gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                      <span className="text-xs font-bold">Uploading to Cloudinary...</span>
                    </div>
                  ) : productForm.image ? (
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 p-1">
                        <img
                          src={productForm.image}
                          alt="Preview"
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.src = '/images/cropped/prod-skyshot.png'; }}
                        />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                          {productForm.image.includes('cloudinary') ? (
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <UploadCloud className="w-3 h-3" /> Cloudinary Hosted
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" /> Image Selected
                            </span>
                          )}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5 max-w-[240px]">
                          {productForm.image}
                        </div>
                        <span className="text-[10px] text-red-600 font-semibold hover:underline block mt-0.5">
                          Click or drag new image to replace
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-3 flex flex-col items-center justify-center text-slate-500 gap-1.5">
                      <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Click to upload cracker photo</span>
                      <span className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 10MB (Auto-hosted on Cloudinary)</span>
                    </div>
                  )}
                </div>

                {/* Presets */}
                <div className="mt-2.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>Or quick pick a standard cracker photo:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: 'Sky Shot', path: '/images/cropped/prod-skyshot.png' },
                      { name: 'Sparklers', path: '/images/cropped/prod-sparklers.png' },
                      { name: 'Flower Pots', path: '/images/cropped/prod-flowerpots.png' },
                      { name: 'Ground Chakkar', path: '/images/cropped/prod-chakkar.png' },
                      { name: 'Fancy Fountain', path: '/images/cropped/cat-fancy-fountains.png' },
                      { name: 'Gift Box', path: '/images/cropped/cat-gift-boxes.png' },
                      { name: 'Rockets', path: '/images/cropped/cat-rockets.png' }
                    ].map(img => (
                      <button
                        key={img.path}
                        type="button"
                        onClick={() => setProductForm(prev => ({ ...prev, image: img.path }))}
                        className={\`text-[10px] font-semibold px-2 py-1 rounded-lg border transition \${
                          productForm.image === img.path
                            ? 'bg-red-50 border-red-400 text-red-600 font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }\`}
                      >
                        {img.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>`;

// Replace product image field
const prodImgStart = '              <div>\n                <label className="block text-xs font-bold text-slate-700 mb-1">Product Photo</label>';
const prodImgEnd = '              <div className="flex items-center gap-6 pt-2">';

const pStartIdx = content.indexOf(prodImgStart);
const pEndIdx = content.indexOf(prodImgEnd, pStartIdx);
if (pStartIdx !== -1 && pEndIdx !== -1) {
  content = content.slice(0, pStartIdx) + productUploadUI + '\n\n' + content.slice(pEndIdx);
}

// 4. Update Category Modal Photo Upload Component
const categoryUploadUI = `              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Thumbnail (Cloudinary Upload)
                </label>

                {/* Upload Zone */}
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 hover:border-red-400 rounded-2xl p-4 transition text-center relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCategoryImageFileChange}
                    disabled={isUploadingCategoryImg}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  {isUploadingCategoryImg ? (
                    <div className="py-4 flex flex-col items-center justify-center text-red-600 gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                      <span className="text-xs font-bold">Uploading to Cloudinary...</span>
                    </div>
                  ) : categoryForm.image ? (
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 p-1">
                        <img
                          src={categoryForm.image}
                          alt="Preview"
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.src = '/images/cropped/prod-skyshot.png'; }}
                        />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                          {categoryForm.image.includes('cloudinary') ? (
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <UploadCloud className="w-3 h-3" /> Cloudinary Hosted
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" /> Image Selected
                            </span>
                          )}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5 max-w-[240px]">
                          {categoryForm.image}
                        </div>
                        <span className="text-[10px] text-red-600 font-semibold hover:underline block mt-0.5">
                          Click or drag new image to replace
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-3 flex flex-col items-center justify-center text-slate-500 gap-1.5">
                      <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Click to upload category icon</span>
                      <span className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 10MB (Auto-hosted on Cloudinary)</span>
                    </div>
                  )}
                </div>

                {/* Preset Category Thumbnails */}
                <div className="mt-2.5">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">Or choose a preset category image:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: 'Sky Shots', path: '/images/cropped/prod-skyshot.png' },
                      { name: 'Flower Pots', path: '/images/cropped/cat-flower-pots.png' },
                      { name: 'Sparklers', path: '/images/cropped/cat-sparklers.png' },
                      { name: 'Rockets', path: '/images/cropped/cat-rockets.png' },
                      { name: 'Chakkars', path: '/images/cropped/cat-ground-chakkars.png' },
                      { name: 'Fountains', path: '/images/cropped/cat-fancy-fountains.png' },
                      { name: 'Gift Boxes', path: '/images/cropped/cat-gift-boxes.png' }
                    ].map(preset => (
                      <button
                        key={preset.path}
                        type="button"
                        onClick={() => setCategoryForm(prev => ({ ...prev, image: preset.path }))}
                        className={\`text-[10px] font-semibold px-2 py-1 rounded-lg border transition \${
                          categoryForm.image === preset.path 
                            ? 'bg-red-50 border-red-400 text-red-600 font-bold shadow-xs' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }\`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>`;

const catImgStart = '              <div>\n                <label className="block text-xs font-bold text-slate-700 mb-1">Thumbnail Image Path</label>';
const catImgEnd = '              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">';

const cStartIdx = content.indexOf(catImgStart);
const cEndIdx = content.indexOf(catImgEnd, cStartIdx);
if (cStartIdx !== -1 && cEndIdx !== -1) {
  content = content.slice(0, cStartIdx) + categoryUploadUI + '\n\n' + content.slice(cEndIdx);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ AdminPage.jsx updated with Cloudinary image upload and previews!');

