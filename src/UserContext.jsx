import React, { createContext, useState, useEffect } from 'react';

// Create a context for user data.
export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On mount, load the user data from localStorage (or fetch from an API if needed)
  useEffect(() => {
    const storedUserId = localStorage.getItem("loggedInUserId");
    if (storedUserId) {
      // Here you can expand the user object as needed.
      setUser({ id: storedUserId });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
