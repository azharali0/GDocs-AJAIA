import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createDocument } from '../src/app/actions/document';
import { prisma } from '../src/lib/prisma';
import { auth } from '../src/auth';

// Mock the dependencies
vi.mock('../src/lib/prisma', () => ({
  prisma: {
    document: {
      create: vi.fn(),
    },
  },
}));

vi.mock('../src/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Document Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a document successfully when authenticated', async () => {
    const mockUser = { user: { id: 'user-123', email: 'test@ajaia.test' } };
    const mockCreatedDoc = { id: 'doc-1', title: 'New Doc', ownerId: 'user-123' };

    // Setup mocks
    (auth as any).mockResolvedValue(mockUser);
    (prisma.document.create as any).mockResolvedValue(mockCreatedDoc);

    // Call action
    const result = await createDocument('New Doc');

    // Assertions
    expect(auth).toHaveBeenCalled();
    expect(prisma.document.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: 'New Doc',
          ownerId: 'user-123',
        })
      })
    );
    expect(result).toEqual(mockCreatedDoc);
  });

  it('should throw an error if unauthenticated', async () => {
    // Setup mock to return null (unauthenticated)
    (auth as any).mockResolvedValue(null);

    // Assert it throws
    await expect(createDocument('New Doc')).rejects.toThrow('Unauthorized');
    expect(prisma.document.create).not.toHaveBeenCalled();
  });
});
