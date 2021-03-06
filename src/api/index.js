/**
 * Parcel object props
 * @typedef {Object} Parcel
 * @property {string} id
 * @property {string} apn
 * @property {string} address
 * @property {boolean} isFireHazard
 */

/**
  * getSurroundingParcels function props
  * @typedef {Object} SurroundingParcel
  * @property {string} acres
  * @property {string} address
  * @property {string} geom
  * @property {string} parcelid
  */

/**
 * @typedef {Object} ParcelCoords
 * @property {number} lat
 * @property {number} lon
 * @property {number} parcelid
 */

const urlBase = 'http://spatial-rest-services-spatial.openshift-gis-apps.gce-containers.crunchydata.com/';
const urlPg_Fs = 'http://pgfeatureserv-scfire.openshift-gis-apps.gce-containers.crunchydata.com';

/** Parcel search functions */
const api = {
  parcels: {
    /**
     * Simulates an API request to search parcels by address
     * @param {string} address
     * @returns {Promise<ParcelCoords>}
     */
    async getParcelCoords(address) {
      const
        addressEncoded = encodeURI(address),
        url = `${urlBase}/geocode/${addressEncoded}`;

      const response = await fetch(url);
      const json = await response.json();
      return json;
    },
    /**
     * Sends an API request to search parcels by distance
     * @param {number | string} parcelId
     * @param {number | string} distance
     * @returns {Promise<Array<SurroundingParcel>>}
     */
    async getSurroundingParcels(gid, distance) {
      const url = `${urlPg_Fs}/functions/parcels_dist/items?in_gid=${gid}&dist=${distance}&limit=1000`
      //const url = `${urlBase}/notify/parcel-and-distance?parcelid=${parcelId}&dist=${distance}`;
      const response = await fetch(url);
      const json = await response.json();
      return json;
    },
    /**
     * Sends an API request to get the firehazard status
     * @param {number | string} parcelId
     * @returns {Promise<boolean>}
     */
    async getFireHazardStatus(gid) {
      const url = `${urlPg_Fs}/collections/groot.assessor_parcels/items/${gid}?properties=gid,fireHazard`;
      const response = await fetch(url);
      const json = await response.json();
      const isFireHazard = json.properties.firehazard === 'Yes';
      return isFireHazard;
    },
    /**
     * Sends an API request to set the firehazard status
     * @param {number | string} parcelId
     * @param {boolean} isFireHazard
     */
    async setFireHazardStatus(gid, isFireHazard) {
      let firehaz = isFireHazard ? 'Y' : 'N';
      const url = `${urlPg_Fs}/functions/set_parcel_firehazard/items?in_gid=${gid}&in_hazard=${firehaz}`;
      await fetch(url);
    },
    async setFireHazardStatusOLD(parcelId, isFireHazard) {
      const url = `${urlBase}/parcel/firehazard/${parcelId}`;
      const body = { firehazard: isFireHazard ? 'Yes' : 'No' };
      await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
  },
};

export default api;
