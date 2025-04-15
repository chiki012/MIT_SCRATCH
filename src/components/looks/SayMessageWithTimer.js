import React, { useState } from "react";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";

const SayMessageWithTimer = ({ character, comp_id }) => {
  const [state, setState] = useState({
    show_msg: false,
    timer_message: "",
    timer_for_msg: 0,
  });

  const displayMessage = () => {
    const el = document.getElementById(`${character.active}-message-box`);
    const el2 = document.getElementById(`${character.active}-message-box1`);
    
    if (!el || !el2) return;

    el2.style.display = "none";

    if (state.show_msg) {
      setState(prev => ({ ...prev, show_msg: false }));
      el.style.display = "none";
      return;
    }

    setState(prev => ({ ...prev, show_msg: true }));

    el.style.display = "block";
    el.style.position = "relative";
    el.innerHTML = state.timer_message;

    window.setTimeout(() => {
      setState(prev => ({ ...prev, show_msg: false }));
      el.style.display = "none";
    }, state.timer_for_msg * 1000);
  };

  return (
    <Paper elevation={3}>
      <div className="rounded text-center bg-purple-500 p-2 my-3">
        <div className="grid grid-cols-2 my-2">
          <div className="text-white">Message</div>
          <input
            className="mx-2 p-1 py-0 text-center"
            type="text"
            value={state.timer_message}
            onChange={(e) =>
              setState(prev => ({ ...prev, timer_message: e.target.value }))
            }
          />
        </div>
        <div className="grid grid-cols-2 my-2">
          <div className="text-white">Timer:</div>
          <input
            className="mx-2 p-1 py-0 text-center"
            type="number"
            value={state.timer_for_msg}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (val > 0) {
                setState(prev => ({ ...prev, timer_for_msg: val }));
              }
            }}
          />
        </div>
        <div
          id={comp_id}
          className="flex flex-row flex-wrap text-center bg-yellow-400 text-black px-2 py-1 my-2 text-sm cursor-pointer"
          onClick={displayMessage}
        >
          {`Say ${state.timer_message}`}
        </div>
      </div>
    </Paper>
  );
};

const mapStateToProps = (state) => ({
  character: state.character,
});

export default connect(mapStateToProps)(SayMessageWithTimer);
