import React, { useContext, useState } from "react";
import waterslide from "../../assets/images/waterslide.jpg";
import { AuthContext } from "../AppContext/AppContext";
import { Link } from "react-router-dom";
import { Avatar } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.jpg";
import borrar from "../../assets/images/delete.png";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayRemove,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const soundex = (s) => {
  const a = s.toLowerCase().split("");
  const f = a.shift();
  const r = a
    .map((v, i, a) => {
      const b = {
        a: "",
        e: "",
        i: "",
        o: "",
        u: "",
        b: 1,
        f: 1,
        p: 1,
        v: 1,
        c: 2,
        g: 2,
        j: 2,
        k: 2,
        q: 2,
        s: 2,
        x: 2,
        z: 2,
        d: 3,
        t: 3,
        l: 4,
        m: 5,
        n: 5,
        r: 6,
      }[v];
      return (b === a[i - 1] ? "" : b) || "";
    })
    .join("");
  return (f + r + "000").slice(0, 4).toUpperCase();
};

const RightSide = () => {
  const [input, setInput] = useState("");
  const { user, userData } = useContext(AuthContext);
  const friendList = userData?.friends;

  const searchFriends = (data) => {
    if (!input.trim()) return data; // Si el input está vacío, devuelve todos los amigos
    const inputSoundex = soundex(input);
    return data.filter((item) => soundex(item["name"]) === inputSoundex);
  };

  const removeFriend = async (id, name, image) => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const getDoc = await getDocs(q);
    const userDocumentId = getDoc.docs[0].id;
    await updateDoc(doc(db, "users", userDocumentId), {
      friends: arrayRemove({ id: id, name: name, image: image }),
    });
  };

  return (
    <div className="flex flex-col h-screen bg-white shadow-lg border-2 rounded-l-xl">
      <div className="flex flex-col items-center relative pt-10">
        <img className="h-48 rounded-md" src={waterslide} alt="nature" />
      </div>
      <p className="font-roboto font-normal text-sm text-gray-700 max-w-fit no-underline tracking-normal leading-tight py-2 mx-2">
        Through photography, the beauty of Mother Nature can be frozen in time.
        This category celebrates the magic of our planet and beyond - from the
        immensity of the great outdoors, to miraculous moments in your own
        backyard.
      </p>
      <div className="mx-2 mt-10">
        <p className="font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">
          Friends:{" "}
        </p>
        <input
          className="border-0 outline-none mt-4"
          name="input"
          value={input}
          type="text"
          placeholder="Search Friends"
          onChange={(e) => setInput(e.target.value)}
        />
        {friendList?.length > 0 ? (
          searchFriends(friendList)?.map((friend) => {
            return (
              <div
                className="flex items-center justify-between hover:bg-gray-100 duration-300 ease-in-out"
                key={friend.id}
              >
                <Link to="">
                  <div className="flex items-center my-2 cursor-pointer">
                    <div className="flex items-center">
                      <Avatar
                        size="xs"
                        variant="circular"
                        src={friend?.image || avatar}
                        alt="avatar"
                      ></Avatar>
                      <p className="ml-4 font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none ">
                        {friend.name}
                      </p>
                    </div>
                  </div>
                </Link>
                <div className="mr-4">
                  <img
                    onClick={() =>
                      removeFriend(friend.id, friend.name, friend.image)
                    }
                    className="cursor-pointer"
                    src={borrar}
                    alt="deleteFriend"
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="mt-10 font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">
            Agregar amigos
          </p>
        )}
      </div>
    </div>
  );
};

export default RightSide;