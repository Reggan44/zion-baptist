import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadImage } from '../storage';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';

// Mock the firebase/storage module
vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
}));

// Mock the firebase config
vi.mock('../firebase', () => ({
  storage: {},
}));

describe('uploadImage', () => {
  const mockFile = new File([''], 'test-image.jpg', { type: 'image/jpeg' });
  const mockFolder = 'test-folder';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should upload an image successfully and return the download URL', async () => {
    const mockDownloadUrl = 'https://example.com/image.jpg';
    const mockSnapshot = { ref: {} };

    vi.mocked(ref).mockReturnValue({} as any);
    vi.mocked(uploadBytes).mockResolvedValue(mockSnapshot as any);
    vi.mocked(getDownloadURL).mockResolvedValue(mockDownloadUrl);

    const url = await uploadImage(mockFile, mockFolder);

    expect(url).toBe(mockDownloadUrl);
    expect(ref).toHaveBeenCalledWith(expect.anything(), expect.stringContaining(mockFolder));
    expect(uploadBytes).toHaveBeenCalledWith(expect.anything(), mockFile);
    expect(getDownloadURL).toHaveBeenCalledWith(mockSnapshot.ref);
  });

  it('should throw an error if no file is provided', async () => {
    await expect(uploadImage(undefined as any, mockFolder)).rejects.toThrow('No file provided');
  });

  it('should throw a custom error if uploadBytes fails', async () => {
    vi.mocked(ref).mockReturnValue({} as any);
    vi.mocked(uploadBytes).mockRejectedValue(new Error('Firebase upload failed'));

    await expect(uploadImage(mockFile, mockFolder)).rejects.toThrow(
      'Failed to upload image. Please check your connection and Firebase permissions.'
    );
    expect(uploadBytes).toHaveBeenCalled();
  });

  it('should throw a custom error if getDownloadURL fails', async () => {
    const mockSnapshot = { ref: {} };
    vi.mocked(ref).mockReturnValue({} as any);
    vi.mocked(uploadBytes).mockResolvedValue(mockSnapshot as any);
    vi.mocked(getDownloadURL).mockRejectedValue(new Error('Failed to get URL'));

    await expect(uploadImage(mockFile, mockFolder)).rejects.toThrow(
      'Failed to upload image. Please check your connection and Firebase permissions.'
    );
    expect(getDownloadURL).toHaveBeenCalled();
  });
});
