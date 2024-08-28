import React from "react";

const CreateAdmin = ({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 w-full mx-auto bg-white p-4"
    >
      <div>
        <label htmlFor="username">Name</label>
        <input
          type="text"
          typeof="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="bg-white w-full border"
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          typeof="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white w-full border"
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          typeof="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-white w-full border"
        />
      </div>

      <button type="submit">Create</button>
    </form>
  );
};

export default CreateAdmin;
