import React, { useState, useEffect, useCallback, useRef } from "react";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";
import { setCharacterDirection } from "../../redux/character/actions";

const Move = ({ character, comp_id, updateDirection }) => {
  const [steps, setSteps] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isColliding, setIsColliding] = useState(false);
  const lastCollisionTime = useRef(0);

  const checkCollision = useCallback((el1, el2) => {
    if (!el1 || !el2) return false;
    
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();
    
    // Small buffer for more reliable detection
    const buffer = 2;
    return !(
      rect1.right + buffer < rect2.left || 
      rect1.left - buffer > rect2.right || 
      rect1.bottom + buffer < rect2.top || 
      rect1.top - buffer > rect2.bottom
    );
  }, []);

  const handleCollisions = useCallback((currentEl) => {
    const collisions = new Set(); // Track all collisions in this frame
    const directionSwaps = new Map(); // Track direction changes for each character

    // Prevent rapid collision checks
    const now = Date.now();
    if (now - lastCollisionTime.current < 100) return;

    // First pass: detect all collisions
    character.characters.forEach((char) => {
      if (char.id !== character.active) {
        const otherEl = document.getElementById(`${char.id}-div`);
        if (otherEl && checkCollision(currentEl, otherEl) && !isColliding) {
          collisions.add(char.id);
        }
      }
    });

    // If there are collisions, handle them all together
    if (collisions.size > 0 && !isColliding) {
      setIsColliding(true);
      lastCollisionTime.current = now;
      
      const currentDirection = direction;
      directionSwaps.set(character.active, currentDirection);

      // Get all involved characters' current directions
      collisions.forEach((collidedId) => {
        const otherEl = document.getElementById(`${collidedId}-div`);
        const otherDirection = parseInt(otherEl.getAttribute('data-direction') || '1', 10);
        directionSwaps.set(collidedId, otherDirection);
      });

      // Perform the direction swaps
      directionSwaps.forEach((originalDirection, charId) => {
        // Find a character to swap with
        const swapPartners = [...collisions].filter(id => id !== charId);
        if (swapPartners.length > 0) {
          // Swap with the first available partner
          const partnerId = swapPartners[0];
          const partnerDirection = directionSwaps.get(partnerId);
          
          // Update directions in Redux store
          updateDirection(charId, partnerDirection);
          updateDirection(partnerId, originalDirection);

          // Update positions to prevent sticking
          const charEl = document.getElementById(`${charId}-div`);
          const partnerEl = document.getElementById(`${partnerId}-div`);
          
          if (charEl && partnerEl) {
            const charLeft = parseInt(charEl.style.left || '0', 10);
            const partnerLeft = parseInt(partnerEl.style.left || '0', 10);
            
            charEl.style.left = `${charLeft - steps * originalDirection}px`;
            partnerEl.style.left = `${partnerLeft - steps * partnerDirection}px`;
          }
        }
      });

      // If this is the active character, update its direction state
      if (directionSwaps.has(character.active)) {
        const newDirection = directionSwaps.get([...collisions][0]);
        setDirection(newDirection);
      }

      // Reset collision state after a short delay
      setTimeout(() => {
        setIsColliding(false);
      }, 100);
    }
  }, [character.characters, character.active, direction, steps, checkCollision, updateDirection, isColliding]);

  const handleClick = useCallback(() => {
    const el = document.getElementById(`${character.active}-div`);
    if (!el || isColliding) return;

    // Ensure position is initialized
    if (!el.style.position) {
      el.style.position = "relative";
      el.style.left = "0px";
    }

    el.setAttribute('data-direction', direction.toString());
    const left = parseInt(el.style.left || '0', 10);
    const newLeft = left + (steps * direction);
    el.style.left = `${newLeft}px`;

    // Use requestAnimationFrame for smoother collision detection
    requestAnimationFrame(() => {
      handleCollisions(el);
    });
  }, [character.active, direction, steps, handleCollisions, isColliding]);

  useEffect(() => {
    // Initialize all characters with direction
    character.characters.forEach((char) => {
      const el = document.getElementById(`${char.id}-div`);
      if (el && !el.hasAttribute('data-direction')) {
        el.setAttribute('data-direction', '1');
        el.style.position = 'relative';
        el.style.left = '0px';
      }
    });
  }, [character.characters]);

  useEffect(() => {
    let interval;
    if (comp_id?.includes('auto') && !isColliding) {
      interval = setInterval(handleClick, 100);
    }
    return () => clearInterval(interval);
  }, [comp_id, handleClick, isColliding]);

  const handleStepsChange = (e) => {
    const value = e.target.value;
    setSteps(value === '' ? 0 : parseInt(value, 10));
  };

  const handleDirectionChange = (e) => {
    const newDirection = parseInt(e.target.value, 10);
    setDirection(newDirection);
    
    const el = document.getElementById(`${character.active}-div`);
    if (el) {
      el.setAttribute('data-direction', newDirection.toString());
    }
  };

  return (
    <Paper elevation={3}>
      <div
        id={comp_id}
        className="text-center rounded bg-pink-700 text-white p-2 my-2 text-sm cursor-pointer mx-auto"
        onClick={handleClick}
      >
        Move X{" "}
        <input
          type="number"
          className="text-black text-center w-16 mx-2"
          value={steps}
          onChange={handleStepsChange}
        />{" "}
        steps
        <select 
          className="text-black ml-2"
          value={direction}
          onChange={handleDirectionChange}
        >
          <option value={1}>Right</option>
          <option value={-1}>Left</option>
        </select>
      </div>
    </Paper>
  );
};

const mapStateToProps = (state) => {
  return {
    character: state.character,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateDirection: (characterId, direction) => 
      dispatch(setCharacterDirection(characterId, direction)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Move);
