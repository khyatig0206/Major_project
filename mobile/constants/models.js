// Model registry — order determines display order on all screens
// accuracy: training accuracy achieved during experiments
// primary: the main model shown as the hero result
export const MODEL_LIST = [
  { key: 'resnet',  label: 'RESNET-50', accuracy: 95.3, primary: true  },
  { key: 'lenet',   label: 'LENET-5',   accuracy: 72.1, primary: false },
  { key: 'vgg16',   label: 'VGG-16',    accuracy: 68.4, primary: false },
  { key: 'alexnet', label: 'ALEXNET',   accuracy: 16.2, primary: false },
];

/** Convenience: the single primary model entry */
export const PRIMARY_MODEL = MODEL_LIST.find((m) => m.primary);
