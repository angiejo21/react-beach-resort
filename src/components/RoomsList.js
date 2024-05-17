import Room from "./Room";

function RoomsList({ rooms }) {
  if (rooms.length === 0) {
    return (
      <div className="empty-search">
        unfortunately no rooms matched your search parameters
      </div>
    );
  }

  return (
    <section className="rooms-list">
      <div className="roomslist-center">
        {rooms.map((item) => (
          <Room key={item.id} room={item} />
        ))}
      </div>
    </section>
  );
}

export default RoomsList;
