import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadImage } from '../storage';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Mock the firebase/storage module
vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
  getStorage: vi.fn()
}));

// Mock the firebase module since storage.ts imports it
vi.mock('../firebase', () => ({
  storage: {}
}));

describe('uploadImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws an error if no file is provided', async () => {
    // @ts-ignore - deliberately passing undefined for testing
    await expect(uploadImage(undefined, 'test-folder')).rejects.toThrow("No file provided");
    // @ts-ignore - deliberately passing null for testing
    await expect(uploadImage(null, 'test-folder')).rejects.toThrow("No file provided");
  });

  it('uploads a file successfully and returns the download URL', async () => {
    const mockFile = new File(['test content'], 'test.png', { type: 'image/png' });
    const mockFolder = 'test-folder';
    const mockDownloadUrl = 'https://example.com/test.png';
    const mockSnapshot = { ref: {} };

    // Setup mocks
    (ref as any).mockReturnValue({});
    (uploadBytes as any).mockResolvedValue(mockSnapshot);
    (getDownloadURL as any).mockResolvedValue(mockDownloadUrl);

    // Call the function
    const result = await uploadImage(mockFile, mockFolder);

    // Verify expectations
    expect(result).toBe(mockDownloadUrl);
    expect(ref).toHaveBeenCalled();
    expect(uploadBytes).toHaveBeenCalledWith({}, mockFile);
    expect(getDownloadURL).toHaveBeenCalledWith(mockSnapshot.ref);
  });

  it('throws an error if the upload fails', async () => {
    const mockFile = new File(['test content'], 'test.png', { type: 'image/png' });
    const mockFolder = 'test-folder';

    // Setup mock to fail
    (ref as any).mockReturnValue({});
    (uploadBytes as any).mockRejectedValue(new Error('Firebase upload error'));

    // Verify the function throws the expected error message
    await expect(uploadImage(mockFile, mockFolder)).rejects.toThrow(
      "Failed to upload image. Please check your connection and Firebase permissions."
    );
  });

  it('throws an error if getting the download URL fails', async () => {
    const mockFile = new File(['test content'], 'test.png', { type: 'image/png' });
    const mockFolder = 'test-folder';
    const mockSnapshot = { ref: {} };

    // Setup mocks
    (ref as any).mockReturnValue({});
    (uploadBytes as any).mockResolvedValue(mockSnapshot);
    (getDownloadURL as any).mockRejectedValue(new Error('Failed to get URL'));

    // Verify the function throws the expected error message
    await expect(uploadImage(mockFile, mockFolder)).rejects.toThrow(
      "Failed to upload image. Please check your connection and Firebase permissions."
    );
  });
});
