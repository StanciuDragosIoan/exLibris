// users-cache.ts
/**
 * A simple in-memory cache for storing user data.
 * Designed to hold raw user data from GitHub (or similar sources) before processing.
 */
class UsersCache2<T = any> {
  private data: Map<string, T>; // Keyed by unique identifier (e.g., login)

  constructor() {
    this.data = new Map<string, T>();
  }

  /**
   * Add a single user to the cache.
   * @param user The user data to cache
   * @param keyExtractor Function to extract unique key (default: login or id)
   */
  public addItem(
    user: T,
    keyExtractor: (u: T) => string = (u: any) => (u as any).login ?? (u as any).id
  ): void {
    const key = keyExtractor(user);
    if (key) {
      this.data.set(key, user);
    } else {
      console.warn('User missing unique identifier – not cached:', user);
    }
  }

  /**
   * Add multiple users at once.
   */
  public addItems(
    users: T[],
    keyExtractor: (u: T) => string = (u: any) => (u as any).login ?? (u as any).id
  ): void {
    users.forEach(user => this.addItem(user, keyExtractor));
  }

  /**
   * Get all cached users as an array (immutable copy).
   */
  public getAll(): T[] {
    return Array.from(this.data.values());
  }

  /**
   * Get a single user by key.
   */
  public getByKey(key: string): T | undefined {
    return this.data.get(key);
  }

  /**
   * Clear the cache.
   */
  public clear(): void {
    this.data.clear();
  }

  /**
   * Get the number of cached items.
   */
  public size(): number {
    return this.data.size;
  }
}

// Example usage
interface GitHubUser {
  login: string;
  id: number;
  name?: string;
  email?: string;
}

const cache2 = new UsersCache<GitHubUser>();

// Add some sample users
cache2.addItems([
  { login: 'alice', id: 123, name: 'Alice Smith', email: 'alice@example.com' },
  { login: 'bob', id: 456, name: 'Bob Johnson' },
  { login: 'charlie', id: 789, name: 'Charlie Brown', email: 'charlie@example.com' },
]);

console.log('Cached users:', cache2.getAll());
console.log('Size:', cache2.size());
console.log('Bob:', cache2.getByKey('bob'));
