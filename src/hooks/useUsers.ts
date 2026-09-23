import { useState, useEffect, useCallback, useMemo } from 'react';
import { UserDocument } from '../types/admin';
import { getUsers, deleteUser, isUserPro } from '../firebase';

export function useUsers() {
  const [users, setUsers] = useState<UserDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'macos' | 'windows' | 'web' | 'linux'>('all');
  const [proFilter, setProFilter] = useState<'all' | 'pro' | 'free'>('all');

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err: any) {
      console.error('[useUsers] Failed to fetch users from Firestore:', err);
      setError(err.message || 'Failed to fetch users from Firestore.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Derived filtered users list
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        (user.displayName && user.displayName.toLowerCase().includes(term)) ||
        (user.email && user.email.toLowerCase().includes(term)) ||
        user.uid.toLowerCase().includes(term);

      const matchesPlatform =
        platformFilter === 'all' || user.primaryPlatform === platformFilter;

      const userIsPro = isUserPro(user);
      const matchesPro =
        proFilter === 'all' ||
        (proFilter === 'pro' && userIsPro) ||
        (proFilter === 'free' && !userIsPro);

      return matchesSearch && matchesPlatform && matchesPro;
    });
  }, [users, searchTerm, platformFilter, proFilter]);

  // KPIs
  const stats = useMemo(() => {
    const now = Date.now();
    const total = users.length;
    const proCount = users.filter((u) => isUserPro(u)).length;
    const macCount = users.filter((u) => u.primaryPlatform === 'macos').length;
    const winCount = users.filter((u) => u.primaryPlatform === 'windows').length;
    const webCount = users.filter((u) => u.primaryPlatform === 'web').length;
    const activeToday = users.filter((u) => now - (u.lastActiveAt || 0) < 24 * 3600000).length;

    return {
      total,
      proCount,
      macCount,
      winCount,
      webCount,
      activeToday,
      conversionRate: total > 0 ? Math.round((proCount / total) * 100) : 0,
    };
  }, [users]);

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.uid !== userId));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete user.');
      return false;
    }
  };

  return {
    users,
    filteredUsers,
    stats,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    platformFilter,
    setPlatformFilter,
    proFilter,
    setProFilter,
    refetch: loadUsers,
    deleteUser: handleDeleteUser,
  };
}
