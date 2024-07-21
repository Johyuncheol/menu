export const fetchMenuAPI = async (path) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BASEURL}/menu${path}`
    );
    if (!response.ok) {
      throw new Error("network error");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${path} menu data :`, error);
    throw error;
  }
};

export const deleteMenuAPI = async (path, id) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BASEURL}/menu${path}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }), // 요청 본문에
      }
    );

    if (!response.ok) {
      throw new Error("network error");
    }

    return;
  } catch (error) {
    console.error(`Error Delete ${path} menu(id: ${id}) data :`, error);
    throw error;
  }
};

export const addMenuAPI = async (path, newData) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BASEURL}/menu${path}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newData }), // 요청 본문에
      }
    );

    if (!response.ok) {
      throw new Error("network error");
    }

    return;
  } catch (error) {
    console.error(`Error Add ${path} menu data :`, error);
    throw error;
  }
};

export const updateMenuAPI = async (path, newData) => {
  try {
    console.log(newData);
    const response = await fetch(
      `${process.env.REACT_APP_BASEURL}/menu${path}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newData }), // 요청 본문에
      }
    );

    if (!response.ok) {
      throw new Error("network error");
    }

    return;
  } catch (error) {
    console.error(`Error Add ${path} menu data :`, error);
    throw error;
  }
};

export const drageMenuAPI = async (path, updatedData) => {
  try {
    console.log(path, updatedData);
    const response = await fetch(
      `${process.env.REACT_APP_BASEURL}/menu${path}/reorder`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updatedData }), // 요청 본문에
      }
    );

    if (!response.ok) {
      throw new Error("network error");
    }

    return;
  } catch (error) {
    console.error(`Error reordering ${path} menu data :`, error);
    throw error;
  }
};

export const updateSubMenuAPI = async (path, sub, id) => {
  try {
    console.log(sub);
    const newData = {
      sub,
      id,
    };
    const response = await fetch(
      `${process.env.REACT_APP_BASEURL}/menu${path}/sub`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newData }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating menu:", error);
    throw error;
  }
};
