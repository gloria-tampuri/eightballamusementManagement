import React, { useContext, useState } from "react";
import classes from "./List.module.css";
import useSWR from "swr";
import { useRouter } from "next/router";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import Delete from "../Delete/Delete";
import { DeleteContext } from "../../../Context/DeleteContext";
import { EditContext } from "../../../Context/EditContext";
import EditModal from "../EditModal/EditModal";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const LocationList = () => {
  const router = useRouter();
  const { assert } = router.query;
  const deleteCtx = useContext(DeleteContext);
  const editCtx = useContext(EditContext);
  const { showDeleteModal, deleteModal } = deleteCtx;
  const { showEditModal, editModal } = editCtx;
  const [selectedLocationId, setSelectedLocationId] = useState();

  const { data, error } = useSWR(`/api/asserts/${assert}`, fetcher, {
    refreshInterval: 1000,
  });

  const deleteHandler = (id) => {
    setSelectedLocationId(id);
    showDeleteModal();
  };

  const editHandler = (id) => {
    setSelectedLocationId(id);
    showEditModal();
  };

  return (
    <div className={classes.list}>
      <button className="printButton" onClick={() => window.print()}>
        Print
      </button>
      <table>
        <thead>
          <tr>
            <th>Location Name</th>
            <th>Physical Address</th>
            <th>Site Owner</th>
            <th>Telephone</th>
            <th>Tokens Given</th>
            <th>Accessories</th>
            <th>Commence Date</th>
            <th>End date</th>
            <th>GPS Co-ordinates</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data?.assert?.location
              .slice()
              .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
              .map((site) => (
                <tr key={site.locationId}>
                  <td className={classes.color}>{site.locationName}</td>
                  <td>{site.physicalAddress}</td>
                  <td>{site.siteOwner}</td>
                  <td>{site.telephoneNumber}</td>
                  <td className={classes.color}>{site.numberofTokens}</td>
                  <td>{site?.accessories ? site.accessories : ""}</td>
                  <td>{site.startDate}</td>
                  <td className={classes.color}>
                    {site.endDate === "" ? "current Location" : site.endDate}
                  </td>
                  <td>
                    {site.gpsAddress ? (
                      site.gpsAddress.map((coordinate, index) => (
                        <div key={index}>{coordinate}</div>
                      ))
                    ) : (
                      <div>No GPS coordinates available</div>
                    )}
                  </td>

                  <td>
                    <div className={classes.action}>
                      <AiOutlineDelete
                        className={classes.delete}
                        onClick={() =>
                          deleteHandler(site.locationId && site.locationId)
                        }
                      />{" "}
                      <AiOutlineEdit
                        className={classes.edit}
                        onClick={() =>
                          editHandler(site.locationId && site.locationId)
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
      {deleteModal && (
        <Delete
          assertId={assert}
          routeUrl="location"
          selectedId={selectedLocationId}
        />
      )}
      {editModal && (
        <EditModal
          assertId={assert}
          routeUrl="location"
          selectedId={selectedLocationId}
        />
      )}
    </div>
  );
};

export default LocationList;
