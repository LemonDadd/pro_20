export type ShareTemplateId = 'minimal' | 'warm' | 'festival' | 'business';

export type ShareSize = 'phone' | 'social' | 'square';

export interface ShareTemplateConfig {
  id: ShareTemplateId;
  name: string;
  previewDesc: string;
}
