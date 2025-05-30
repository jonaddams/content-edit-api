import NutrientViewer, { PSPDFKit } from '@nutrient-sdk/viewer';

declare global {
  interface Window {
    // Nutrient Web SDK will be available on window.NutrientViewer once loaded
    NutrientViewer?: typeof NutrientViewer;
    PSPDFKit: typeof PSPDFKit;
    viewerInstance?: any;
  }
  // Define the type for the instance returned by NutrientViewer.load
  interface NutrientViewerInstance {
    [key: string]: any;
  }
}
