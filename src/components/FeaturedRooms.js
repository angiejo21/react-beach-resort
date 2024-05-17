import { useRooms } from "../context";
import Loading from "./Loading";
import Room from "./Room";
import Title from "./Title";

function FeaturedRooms() {
  const { isLoading, featuredRooms: rooms } = useRooms();

  return (
    <section className="featured-rooms">
      <Title title="featured rooms" />
      <div className="featured-rooms-center">
        {isLoading ? (
          <Loading />
        ) : (
          rooms.map((room, index) => <Room key={index} room={room} />)
        )}
      </div>
    </section>
  );
}

export default FeaturedRooms;
