import { ADD_CHARACTER, SET_ACTIVE_CHARACTER, SET_ANGLE, SET_CHARACTER_DIRECTION } from "./actionTypes";

export const setCharacterAngle = (characterAngle) => {
  return {
    type: SET_ANGLE,
    angle: characterAngle,
  };
};

export const setActive = (character_id) => {
  return {
    type: SET_ACTIVE_CHARACTER,
    id: character_id,
  };
};

export const addCharacter = () => {
  return {
    type: ADD_CHARACTER,
  };
};

export const setCharacterDirection = (character_id, direction) => {
  return {
    type: SET_CHARACTER_DIRECTION,
    id: character_id,
    direction: direction,
  };
};