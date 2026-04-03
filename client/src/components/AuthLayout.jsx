const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-300 to-indigo-400">
      {children}
    </div>
  );
};

export default AuthLayout;