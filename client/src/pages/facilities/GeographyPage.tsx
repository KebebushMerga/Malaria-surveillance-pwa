import { useEffect, useState } from "react";

import {
  getRegions,
  getZones,
  getWoredas,
  type Region,
  type Zone,
  type Woreda,
} from "../../services/geographyService";

const GeographyPage = () => {
  const [regions, setRegions] =
    useState<Region[]>([]);

  const [zones, setZones] =
    useState<Zone[]>([]);

  const [woredas, setWoredas] =
    useState<Woreda[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadGeography = async () => {
      try {
        setLoading(true);

        const [
          regionData,
          zoneData,
          woredaData,
        ] = await Promise.all([
          getRegions(),
          getZones(),
          getWoredas(),
        ]);

        setRegions(regionData.regions);
        setZones(zoneData.zones);
        setWoredas(woredaData.woredas);
      } catch (error: any) {
        setError(
          error.response?.data?.message ||
            "Failed to load geographic data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadGeography();
  }, []);

  if (loading) {
    return <p>Loading geography...</p>;
  }

  return (
    <section>
      <h1>Geography</h1>

      {error && <p>{error}</p>}

      <div>
        <h2>
          Regions ({regions.length})
        </h2>

        {regions.map((region) => (
          <p key={region._id}>
            {region.name}
          </p>
        ))}
      </div>

      <div>
        <h2>
          Zones ({zones.length})
        </h2>

        {zones.map((zone) => (
          <p key={zone._id}>
            {zone.name}
          </p>
        ))}
      </div>

      <div>
        <h2>
          Woredas ({woredas.length})
        </h2>

        {woredas.map((woreda) => (
          <p key={woreda._id}>
            {woreda.name}
          </p>
        ))}
      </div>
    </section>
  );
};

export default GeographyPage;