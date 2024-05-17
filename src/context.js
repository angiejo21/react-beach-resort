import { createContext, useContext, useEffect, useReducer } from "react";
import Client from "./Contentful";

const RoomContext = createContext();

const initialFilterState = {
  type: "all",
  capacity: 1,
  price: 0,
  minPrice: 0,
  maxPrice: 0,
  minSize: 0,
  maxSize: 0,
  breakfast: false,
  pets: false,
};

const initialState = {
  rooms: [],
  sortedRooms: [],
  featuredRooms: [],
  isLoading: true,
};

function filterReducer(state, action) {
  switch (action.type) {
    case "initial":
      return {
        ...state,
        price: action.payload.maxPrice,
        maxPrice: action.payload.maxPrice,
        maxSize: action.payload.maxSize,
      };
    case "type":
      return { ...state, type: action.payload };
    case "capacity":
      return { ...state, capacity: +action.payload };
    case "price":
      return { ...state, price: +action.payload };
    case "minPrice":
      return { ...state, minPrice: +action.payload };
    case "maxPrice":
      return { ...state, maxPrice: +action.payload };
    case "minSize":
      return { ...state, minSize: +action.payload };
    case "maxSize":
      return { ...state, maxSize: +action.payload };
    case "breakfast":
      return { ...state, breakfast: action.payload };
    case "pets":
      return { ...state, pets: action.payload };
    default:
      throw new Error("Action not recognized");
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "init":
      return {
        ...state,
        rooms: action.payload.rooms,
        featuredRooms: action.payload.featuredRooms,
        sortedRooms: action.payload.rooms,
      };
    case "rooms":
      return { ...state, rooms: action.payload };
    case "sortedRooms":
      return { ...state, sortedRooms: action.payload };
    case "filteredRooms":
      return { ...state, filteredRooms: action.payload };
    case "isLoading":
      return { ...state, isLoading: action.payload };
    default:
      throw new Error("Action not recognized");
  }
}

function RoomsProvider({ children }) {
  const [{ rooms, sortedRooms, featuredRooms, isLoading }, dispatch] =
    useReducer(reducer, initialState);
  const [
    {
      type,
      capacity,
      price,
      minPrice,
      maxPrice,
      minSize,
      maxSize,
      breakfast,
      pets,
    },
    dispatchFilter,
  ] = useReducer(filterReducer, initialFilterState);

  function formatData(items) {
    let tempItems = items.map((item) => {
      let id = item.sys.id;
      let images = item.fields.images.map((image) => image.fields.file.url);

      let room = { ...item.fields, images, id };
      return room;
    });
    return tempItems;
  }

  function getRoom(slug) {
    let tempRooms = [...rooms];
    const room = tempRooms.find((room) => room.slug === slug);
    return room;
  }

  function handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = event.target.name;
    dispatchFilter({ type: name, payload: value });
  }

  function filterRooms() {
    let tempRooms = [...rooms];
    if (type !== "all") {
      tempRooms = tempRooms.filter((room) => room.type === type);
    }
    if (capacity !== 1) {
      tempRooms = tempRooms.filter((room) => room.capacity >= capacity);
    }
    tempRooms = tempRooms.filter((room) => room.price <= price);
    tempRooms = tempRooms.filter(
      (room) => room.size > minSize && room.size < maxSize
    );
    if (breakfast) {
      tempRooms = tempRooms.filter((room) => room.breakfast === true);
    }
    if (pets) {
      tempRooms = tempRooms.filter((room) => room.pets === true);
    }
    dispatch({ type: "sortedRooms", payload: tempRooms });
  }

  async function getData() {
    try {
      let res = await Client.getEntries({
        content_type: "beachResortRooms",
        order: "-sys.createdAt",
      });
      let rooms = formatData(res.items);
      let featuredRooms = rooms.filter((room) => room.featured === true);
      let maxPrice = Math.max(...rooms.map((item) => item.price));
      let maxSize = Math.max(...rooms.map((item) => item.size));

      dispatch({ type: "init", payload: { rooms, featuredRooms } });
      dispatchFilter({ type: "initial", payload: { maxPrice, maxSize } });
      dispatch({ type: "isLoading", payload: false });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(
    function () {
      filterRooms();
    },
    [
      type,
      capacity,
      price,
      minPrice,
      maxPrice,
      minSize,
      maxSize,
      breakfast,
      pets,
    ]
  );

  useEffect(function () {
    getData();
  });

  return (
    <RoomContext.Provider
      value={{
        rooms,
        sortedRooms,
        featuredRooms,
        isLoading,
        getRoom,
        handleChange,
        type,
        capacity,
        price,
        minPrice,
        maxPrice,
        minSize,
        maxSize,
        breakfast,
        pets,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

//custom hook
function useRooms() {
  const context = useContext(RoomContext);
  if (context === undefined)
    throw new Error("RoomContext is being used outside its provider");
  return context;
}

export { RoomsProvider, useRooms };
