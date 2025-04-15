import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { getComponent } from "./getComponents";
import {
  motionComponents,
  looksComponents,
  controlComponents,
  eventsComponents,
} from "./SidebarConstants";

const categories = [
  { 
    id: 'motion',
    label: 'Motion',
    color: 'bg-pink-400',
    textColor: 'text-pink-400',
    components: motionComponents 
  },
  { 
    id: 'looks',
    label: 'Looks',
    color: 'bg-purple-400',
    textColor: 'text-purple-400',
    components: looksComponents 
  },
  { 
    id: 'events',
    label: 'Events',
    color: 'bg-yellow-400',
    textColor: 'text-yellow-400',
    components: eventsComponents 
  },
  { 
    id: 'control',
    label: 'Control',
    color: 'bg-red-500',
    textColor: 'text-red-500',
    components: controlComponents 
  }
];

export default function Sidebar() {
  const [activeCategory, setActiveCategory] = useState('motion');

  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-1 border-r border-gray-200">
      <div className="font-semibold mb-3 text-center border rounded text-white bg-pink-400 p-1 w-full text-sm">
        Side Bar
      </div>
      
      <div className="w-full flex gap-2">
        {/* Category Buttons */}
        <div className="w-10 flex flex-col gap-1.5">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                activeCategory === category.id 
                  ? category.color + ' text-white' 
                  : 'bg-gray-100 ' + category.textColor + ' hover:bg-gray-200'
              }`}
            >
              <span className="text-sm font-semibold">
                {category.label.charAt(0)}
              </span>
            </button>
          ))}
        </div>

        {/* Components Area */}
        <div className="flex-1">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className={activeCategory === category.id ? 'block' : 'hidden'}
            >
              <div className={`font-semibold mb-1.5 text-xs ${category.textColor}`}>
                {category.label}
              </div>
              <Droppable droppableId={`sideArea-${category.id}`} type="COMPONENTS">
                {(provided) => (
                  <ul
                    className={`sideArea-${category.id}`}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {category.components.map((x, i) => (
                      <Draggable
                        key={`${x}-sideArea`}
                        draggableId={`${x}-sideArea`}
                        index={i}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="my-1"
                          >
                            {getComponent(x)}
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}