import { useState, useEffect, useCallback } from 'react';
import { adminAuthService } from '../../services/adminAuth';
import { useUsers } from '../../hooks/useUsers';
import { AdminLogin } from './AdminLogin';
import { AdminLayout, AdminTab } from './AdminLayout';
import { UsersList } from './UsersList';
import { UserDetailView } from './UserDetailView';
import { GlobalSettingsView } from './GlobalSettingsView';

interface AdminRouterProps {
  onNavigateHome: () => void;
  initialUserId?: string | null;
}

export function AdminRouter({ onNavigateHome }: AdminRouterProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(adminAuthService.isAuthenticated());

  const parseRoute = useCallback(() => {
    const path = window.location.pathname;
    const match = path.match(/\/admin\/users\/([^/]+)/);
    if (match && match[1]) {
      return { tab: 'user-detail' as AdminTab, userId: match[1] };
    }
    if (path.startsWith('/admin/settings')) {
      return { tab: 'settings' as AdminTab, userId: null };
    }
    return { tab: 'users' as AdminTab, userId: null };
  }, []);

  const [routeState, setRouteState] = useState(parseRoute);

  useEffect(() => {
    const handlePopState = () => {
      setRouteState(parseRoute());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [parseRoute]);

  const navigateTo = (url: string) => {
    window.history.pushState({}, '', url);
    setRouteState(parseRoute());
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setRouteState(parseRoute());
  };

  const handleLogout = () => {
    adminAuthService.logout();
    setIsAuthenticated(false);
    navigateTo('/admin');
  };

  const handleSelectUser = (userId: string) => {
    navigateTo(`/admin/users/${userId}`);
  };

  const handleBackToUsers = () => {
    navigateTo('/admin/users');
  };

  const handleTabChange = (tab: AdminTab) => {
    if (tab === 'users') {
      navigateTo('/admin/users');
    } else if (tab === 'settings') {
      navigateTo('/admin/settings');
    }
  };

  const {
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
    refetch,
  } = useUsers();

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onNavigateHome={onNavigateHome}
      />
    );
  }

  return (
    <AdminLayout
      currentTab={routeState.tab}
      onSelectTab={handleTabChange}
      onNavigateHome={onNavigateHome}
      onLogout={handleLogout}
      userCount={stats.total}
    >
      {routeState.tab === 'users' && (
        <UsersList
          users={users}
          filteredUsers={filteredUsers}
          stats={stats}
          isLoading={isLoading}
          error={error}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          platformFilter={platformFilter}
          setPlatformFilter={setPlatformFilter}
          proFilter={proFilter}
          setProFilter={setProFilter}
          onSelectUser={handleSelectUser}
          onRefresh={refetch}
        />
      )}

      {routeState.tab === 'user-detail' && routeState.userId && (
        <UserDetailView
          userId={routeState.userId}
          onBack={handleBackToUsers}
        />
      )}

      {routeState.tab === 'settings' && <GlobalSettingsView />}
    </AdminLayout>
  );
}
