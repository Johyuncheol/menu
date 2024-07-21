export const ADD_MENU = "MENU/ADD";
export const DELETE_MENU = "MENU/DELETE";
export const UPDATE_MENU = "MENU/UPDATE";
export const DRAGE_MENU = "MENU/DRAGE";

// 액션 생성자
export const addMenu = (menuType, value) => ({
  type: ADD_MENU,
  menuType,
  value,
});

export const deleteMenu = (menuType, menu_id) => ({
  type: DELETE_MENU,
  menuType,
  menu_id,
});

export const updateMenu = (menuType, menu_id, value) => ({
  type: UPDATE_MENU,
  menuType,
  menu_id,
  value,
});

export const drageMenu = (menuType, value) => ({
  type: DRAGE_MENU,
  menuType,
  value,
});

// 초기 상태
const initialState = {
  adminMenu: [
    {
      id: 1,
      title: "제목1",
      sub: [1, 2, 3, 4, 5],
      toggle: true,
      admin: "admin",
    },
    {
      id: 2,
      title: "제목2",
      sub: [1, 2, 3, 4, 5],
      toggle: true,
      admin: "admin",
    },
    {
      id: 3,
      title: "제목3",
      sub: [1, 2, 3, 4, 5],
      toggle: true,
      admin: "admin",
    },
    {
      id: 4,
      title: "제목4",
      sub: [1, 2, 3, 4, 5],
      toggle: true,
      admin: "admin",
    },
    {
      id: 5,
      title: "제목6",
      sub: [1, 2, 3, 4, 5],
      toggle: true,
      admin: "admin",
    },
  ],
  generalMenu: [
    {
      id: 7,
      title: "제목5",
      sub: [1, 2, 3, 4, 5],
      toggle: true,
      admin: "general",
    },
    {
      id: 6,
      title: "제목13",
      sub: [1, 2, 3, 4, 5],
      toggle: true,
      admin: "general",
    },
  ],
};

const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MENU:
      return {
        ...state,
        [action.menuType]: [...state[action.menuType], action.value],
      };
    case DELETE_MENU:
      return {
        ...state,
        [action.menuType]: state[action.menuType].filter(
          (item) => item.id !== action.menu_id
        ),
      };

    case DRAGE_MENU:
      console.log(action.value)
      return { ...state, [action.menuType]: action.value };

    case UPDATE_MENU:
      const newData = state[action.menuType].map((item) =>
        item.id === action.menu_id ? { ...item, ...action.value } : item
      );
      return { ...state, [action.menuType]: newData };

    default:
      return state;
  }
};

export default menuReducer;
