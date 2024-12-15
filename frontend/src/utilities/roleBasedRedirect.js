export const roleBasedRedirect = (role) => {
    switch (role) {
      case 'student':
        return '/dashboard/student';
      case 'teacher':
        return '/dashboard/teacher';
      case 'admin':
        return '/dashboard/admin';
      default:
        return '/';
    }
  };
  