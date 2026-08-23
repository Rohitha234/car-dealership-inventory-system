// Import React hooks for managing component state and performing actions on component load
import { useEffect, useState } from "react";

// Import Axios for making HTTP requests to the backend API
import axios from "axios";

function App() {
  // Store the list of cars retrieved from the backend
  const [cars, setCars] = useState<any[]>([]);

  // Manage the user's authentication and registration screen state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Store user input for registration and login
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Manage car editing, searching, and add-car form visibility
  const [editingCar, setEditingCar] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Store input values for adding a new car
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // Fetch all cars from the backend and update the car inventory state
  const fetchCars = async () => {
    try {
      const response = await axios.get("http://localhost:3000/cars");
      setCars(response.data.cars);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  // Check for an existing login token and load car data when the application starts
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    }

    fetchCars();
  }, []);

  // Authenticate the user and store the JWT token after successful login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password
      });

      // Store the JWT token to maintain the user's login session
      localStorage.setItem("token", response.data.token);

      setIsLoggedIn(true);

      alert("Login successful!");

    } catch (error: any) {
      console.error("Login error:", error);

      alert(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  // Register a new user and reset the form after successful registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/register",
        {
          name,
          email,
          password
        }
      );

      alert(response.data.message);

      // Clear registration form fields
      setName("");
      setEmail("");
      setPassword("");

      // Return to the login screen after successful registration
      setIsRegistering(false);

    } catch (error: any) {
      console.error("Registration error:", error);

      alert(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  // Remove the stored token and clear user data when logging out
  const handleLogout = () => {
    localStorage.removeItem("token");

    setIsLoggedIn(false);
    setName("");
    setEmail("");
    setPassword("");

    alert("Logged out successfully!");
  };

  // Validate car details and send an authenticated request to add a new car
  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure that all required car fields are filled
    if (!brand || !model || !year || !price || quantity === "") {
      alert("Please fill in all fields");
      return;
    }

    // Validate numerical values before sending the request
    if (
      Number(year) <= 0 ||
      Number(price) <= 0 ||
      Number(quantity) < 0
    ) {
      alert("Please enter valid car values");
      return;
    }

    try {
      // Retrieve the JWT token for accessing the protected endpoint
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:3000/cars",
        {
          brand,
          model,
          year: Number(year),
          price: Number(price),
          quantity: Number(quantity)
        },
        {
          // Send the JWT token in the Authorization header
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Reset the form after successfully adding the car
      setBrand("");
      setModel("");
      setYear("");
      setPrice("");
      setQuantity("");

      setShowForm(false);

      // Reload the inventory to display the newly added car
      fetchCars();

      alert("Car added successfully!");

    } catch (error: any) {
      console.error("Error adding car:", error);

      alert(
        error.response?.data?.message || "Failed to add car"
      );
    }
  };

  // Confirm deletion and remove the selected car from the inventory
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this car?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      // Retrieve the JWT token for accessing the protected endpoint
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:3000/cars/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update the local car list without reloading the entire page
      setCars(cars.filter((car) => car.id !== id));

      alert("Car deleted successfully!");

    } catch (error: any) {
      console.error("Error deleting car:", error);

      alert(
        error.response?.data?.message || "Failed to delete car"
      );
    }
  };

  // Validate and update the selected car using its ID
  const handleUpdate = async () => {
    // Ensure that all required fields contain valid values
    if (
      !editingCar.brand ||
      !editingCar.model ||
      editingCar.year === "" ||
      editingCar.price === "" ||
      editingCar.quantity === ""
    ) {
      alert("Please fill in all fields");
      return;
    }

    // Validate numerical values before updating the car
    if (
      Number(editingCar.year) <= 0 ||
      Number(editingCar.price) <= 0 ||
      Number(editingCar.quantity) < 0
    ) {
      alert("Please enter valid car values");
      return;
    }

    try {
      // Retrieve the JWT token for accessing the protected endpoint
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3000/cars/${editingCar.id}`,
        {
          brand: editingCar.brand,
          model: editingCar.model,
          year: Number(editingCar.year),
          price: Number(editingCar.price),
          quantity: Number(editingCar.quantity)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update the modified car in the local state
      setCars(
        cars.map((car) =>
          car.id === editingCar.id
            ? {
                ...car,
                brand: editingCar.brand,
                model: editingCar.model,
                year: editingCar.year,
                price: editingCar.price,
                quantity: editingCar.quantity
              }
            : car
        )
      );

      // Close the edit form after successful update
      setEditingCar(null);

      alert("Car updated successfully!");

    } catch (error: any) {
      console.error("Error updating car:", error);

      alert(
        error.response?.data?.message || "Failed to update car"
      );
    }
  };

  // Filter cars based on the entered brand or model search value
  const filteredCars = cars.filter(
    (car) =>
      car.brand.toLowerCase().includes(search.toLowerCase()) ||
      car.model.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate dashboard statistics from the current car inventory
  const totalCars = cars.length;

  const totalQuantity = cars.reduce(
    (total, car) => total + Number(car.quantity),
    0
  );

  const totalValue = cars.reduce(
    (total, car) =>
      total + Number(car.price) * Number(car.quantity),
    0
  );

  // Display the login or registration screen when the user is not authenticated
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <form
          onSubmit={isRegistering ? handleRegister : handleLogin}
          className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"
        >
          <h1 className="mb-2 text-center text-3xl font-bold text-blue-600">
            Car Dealership
          </h1>

          <p className="mb-6 text-center text-gray-500">
            {isRegistering
              ? "Create your account"
              : "Login to manage your car inventory"}
          </p>

          {/* Display the name field only during registration */}
          {isRegistering && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-6 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            {isRegistering ? "Register" : "Login"}
          </button>

          {/* Allow users to switch between login and registration forms */}
          <p className="mt-5 text-center text-sm text-gray-600">
            {isRegistering
              ? "Already have an account?"
              : "Don't have an account?"}

            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setName("");
                setEmail("");
                setPassword("");
              }}
              className="ml-2 font-medium text-blue-600 hover:underline"
            >
              {isRegistering ? "Login" : "Register"}
            </button>
          </p>
        </form>
      </div>
    );
  }

  // Display the main inventory dashboard after successful authentication
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Application header and logout control */}
      <header className="flex items-center justify-between bg-blue-600 px-8 py-5 text-white shadow-md">
        <div>
          <h1 className="text-2xl font-bold">
            Car Dealership Inventory System
          </h1>

          <p className="text-sm text-blue-100">
            Manage your car inventory easily
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-white px-4 py-2 font-medium text-blue-600 hover:bg-gray-100"
        >
          Logout
        </button>
      </header>

      <main className="p-8">

        <h2 className="mb-6 text-3xl font-bold text-gray-800">
          Dashboard
        </h2>

        {/* Display summary statistics for the current inventory */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">

          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Total Car Models
            </p>

            <h3 className="mt-2 text-3xl font-bold text-blue-600">
              {totalCars}
            </h3>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Total Cars in Stock
            </p>

            <h3 className="mt-2 text-3xl font-bold text-green-600">
              {totalQuantity}
            </h3>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Total Inventory Value
            </p>

            <h3 className="mt-2 text-3xl font-bold text-purple-600">
              ${totalValue.toLocaleString()}
            </h3>
          </div>

        </div>

        {/* Display the edit form only when a car is selected for editing */}
        {editingCar && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">
              Edit Car
            </h2>

            <input
              type="text"
              value={editingCar.brand}
              onChange={(e) =>
                setEditingCar({
                  ...editingCar,
                  brand: e.target.value
                })
              }
              className="mb-3 w-full rounded border p-2"
              placeholder="Brand"
            />

            <input
              type="text"
              value={editingCar.model}
              onChange={(e) =>
                setEditingCar({
                  ...editingCar,
                  model: e.target.value
                })
              }
              className="mb-3 w-full rounded border p-2"
              placeholder="Model"
            />

            <input
              type="number"
              value={editingCar.year}
              onChange={(e) =>
                setEditingCar({
                  ...editingCar,
                  year: Number(e.target.value)
                })
              }
              className="mb-3 w-full rounded border p-2"
              placeholder="Year"
            />

            <input
              type="number"
              value={editingCar.price}
              onChange={(e) =>
                setEditingCar({
                  ...editingCar,
                  price: Number(e.target.value)
                })
              }
              className="mb-3 w-full rounded border p-2"
              placeholder="Price"
            />

            <input
              type="number"
              value={editingCar.quantity}
              onChange={(e) =>
                setEditingCar({
                  ...editingCar,
                  quantity: Number(e.target.value)
                })
              }
              className="mb-4 w-full rounded border p-2"
              placeholder="Quantity"
            />

            <div className="flex gap-3">
              <button
                onClick={handleUpdate}
                className="rounded bg-green-600 px-5 py-2 text-white hover:bg-green-700"
              >
                Update Car
              </button>

              <button
                onClick={() => setEditingCar(null)}
                className="rounded bg-gray-500 px-5 py-2 text-white hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Main inventory section with search and add-car functionality */}
        <div className="rounded-lg bg-white p-6 shadow">

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Cars Inventory
            </h2>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search by brand or model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={() => setShowForm(true)}
                className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
              >
                + Add Car
              </button>
            </div>
          </div>

          {/* Display the add-car form when requested by the user */}
          {showForm && (
            <form
              onSubmit={handleAddCar}
              className="mb-6 rounded-lg border bg-gray-50 p-6"
            >
              <h3 className="mb-4 text-xl font-semibold text-gray-700">
                Add New Car
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <input
                  type="text"
                  placeholder="Brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="rounded border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="text"
                  placeholder="Model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="rounded border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="number"
                  placeholder="Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="rounded border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="rounded border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="rounded border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <div className="mt-5 flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-green-600 px-5 py-2 font-medium text-white hover:bg-green-700"
                >
                  Save Car
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg bg-gray-500 px-5 py-2 font-medium text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Display the filtered car inventory in a table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">

              <thead>
                <tr className="bg-gray-200 text-left text-gray-700">
                  <th className="p-3">ID</th>
                  <th className="p-3">Brand</th>
                  <th className="p-3">Model</th>
                  <th className="p-3">Year</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCars.length > 0 ? (
                  // Render each car that matches the search criteria
                  filteredCars.map((car) => (
                    <tr key={car.id} className="border-b">
                      <td className="px-3 py-3">{car.id}</td>
                      <td className="px-3 py-3">{car.brand}</td>
                      <td className="px-3 py-3">{car.model}</td>
                      <td className="px-3 py-3">{car.year}</td>

                      <td className="px-3 py-3">
                        ${Number(car.price).toLocaleString()}
                      </td>

                      <td className="px-3 py-3">
                        {car.quantity}
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex gap-2">
                          <button
                            // Select the current car and open the edit form
                            onClick={() => setEditingCar(car)}
                            className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                          >
                            Edit
                          </button>

                          <button
                            // Delete the selected car after confirmation
                            onClick={() => handleDelete(car.id)}
                            className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  // Display a message when no cars match the search
                  <tr>
                    <td
                      colSpan={7}
                      className="px-3 py-8 text-center text-gray-500"
                    >
                      No cars found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

        </div>
      </main>
    </div>
  );
}

// Export the main application component
export default App;