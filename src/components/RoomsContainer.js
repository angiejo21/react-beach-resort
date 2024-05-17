import RoomsFilter from "./RoomsFilter";
import RoomsList from "./RoomsList";
import Loading from "./Loading";
import { useRooms } from "../context";

function RoomsContainer() {
  const { rooms, isLoading, sortedRooms } = useRooms();
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div>
      <RoomsFilter rooms={rooms} />
      <RoomsList rooms={sortedRooms} />
    </div>
  );
}

export default RoomsContainer;
