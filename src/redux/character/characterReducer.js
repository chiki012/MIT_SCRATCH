import { SET_ACTIVE_CHARACTER, ADD_CHARACTER, SET_ANGLE, SET_CHARACTER_DIRECTION } from "./actionTypes";

const initialState = {
  characters: [{ 
    id: "sprite0", 
    angle: 0,
    direction: 1 
  }],
  active: "sprite0",
};

export const characterReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_CHARACTER:
      return {
        ...state,
        active: action.id,
      };

    case ADD_CHARACTER:
      return {
        ...state,
        characters: [
          ...state.characters,
          {
            id: `sprite${state.characters.length}`,
            angle: 0,
            direction: 1
          }
        ],
      };

    case SET_ANGLE:
      return {
        ...state,
        characters: state.characters.map(character => 
          character.id === state.active
            ? { ...character, angle: action.angle }
            : character
        ),
      };

    case SET_CHARACTER_DIRECTION:
      return {
        ...state,
        characters: state.characters.map(character =>
          character.id === action.id
            ? { ...character, direction: action.direction }
            : character
        ),
      };

    default:
      return state;
  }
};

export default characterReducer;