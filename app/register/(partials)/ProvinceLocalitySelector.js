import React from "react";
import {LocalitiesByProvince} from "./constants"

const ProvinceLocalitySelector = ({
    province, 
    setProvince, 
    locality, 
    setLocality,
}) => {
    return (
        <>
            <select
                value = {province}
                onChange = {(e) => setProvince(e.target.value)}
                required
            >
                <option value = "">Selecciona una provincia</option>
                {Object.keys(LocalitiesByProvince).map((province) => (
                    <option key={province} value={province}>
                        {province}
                    </option>
                ))}
            </select>
            {province && (
                <select
                value = {locality}
                onChange = {(e) => setLocality(e.target.value)}
                required
                >

                <option value = "">Selecciona un municipio</option>
                {LocalitiesByProvince[province].map((locality) => (
                    <option key={locality} value={locality}>
                        {locality}
                    </option>
                ))}
                </select>
            )}
        </>
    );
};

export default ProvinceLocalitySelector;