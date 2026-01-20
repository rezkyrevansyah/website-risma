/**
 * Supabase Mock Helper for Unit Tests
 * Provides reusable mock factories for Supabase client operations
 */

type MockQueryResult = {
  data: unknown;
  error: null | { message: string; code?: string };
};

type MockQueryBuilder = {
  select: jest.Mock;
  insert: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
  eq: jest.Mock;
  order: jest.Mock;
  limit: jest.Mock;
  single: jest.Mock;
};

export const createMockQueryBuilder = (
  result: MockQueryResult = { data: null, error: null }
): MockQueryBuilder => {
  const builder: MockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue(result),
  };

  // Make chainable methods return the builder
  builder.select.mockReturnValue(builder);
  builder.insert.mockReturnValue(builder);
  builder.update.mockReturnValue(builder);
  builder.delete.mockReturnValue(builder);
  builder.eq.mockReturnValue(builder);
  builder.order.mockReturnValue(builder);
  builder.limit.mockReturnValue(builder);

  return builder;
};

export const createMockSupabaseClient = (overrides: {
  queryResult?: MockQueryResult;
  authUser?: { id: string; email?: string } | null;
  authError?: { message: string } | null;
  signInResult?: MockQueryResult;
  signUpResult?: { user: unknown; session: unknown } | null;
  signUpError?: { message: string } | null;
} = {}) => {
  const queryBuilder = createMockQueryBuilder(
    overrides.queryResult || { data: null, error: null }
  );

  return {
    from: jest.fn().mockReturnValue(queryBuilder),
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: overrides.authUser ?? { id: 'test-user-id', email: 'test@example.com' } },
        error: overrides.authError ?? null,
      }),
      signInWithPassword: jest.fn().mockResolvedValue(
        overrides.signInResult || { data: null, error: null }
      ),
      signUp: jest.fn().mockResolvedValue({
        data: overrides.signUpResult ?? { user: { id: 'new-user-id' }, session: null },
        error: overrides.signUpError ?? null,
      }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
    },
    storage: {
      from: jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue({ data: { path: 'test-path' }, error: null }),
        remove: jest.fn().mockResolvedValue({ data: null, error: null }),
        getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/image.jpg' } }),
      }),
    },
    _queryBuilder: queryBuilder, // Expose for direct manipulation in tests
  };
};

// Type for the mock client
export type MockSupabaseClient = ReturnType<typeof createMockSupabaseClient>;
