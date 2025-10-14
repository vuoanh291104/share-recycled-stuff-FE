export interface PostPurpose {
  id: number;
  description: string;
  code: 'FREE' | 'SALE' | 'NEWS';
}

export const PostPurposeValues: PostPurpose[] = [
  { id: 1, description: "Cho tặng miễn phí", code: 'FREE' },
  { id: 2, description: "Bán", code: 'SALE' },
  { id: 3, description: "Tin tức/ thông tin", code: 'NEWS' },
];

export const getPurposeDescription = (code: string): string => {
  return PostPurposeValues.find(p => p.code === code)?.description || '';
};
