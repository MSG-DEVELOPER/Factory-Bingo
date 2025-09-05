import { conn } from '../../lib/mysql';
import React from 'react';

import TablaVendedores from './tablaVendedores';

async function page() {
 const sellers = await conn.query(`
    SELECT
      u.id,
      u.nombre,
      u.apellidos,
      u.codigo_vendedor,
      u.comision,
      COUNT(r.id) AS num_referidos
    FROM usuarios u
    LEFT JOIN usuarios r ON r.id_vendedor = u.id
    WHERE u.rol_id = 2
    GROUP BY u.id, u.nombre, u.apellidos, u.codigo_vendedor
  `);

 return <TablaVendedores sellers={sellers}/>;
}

export default page;
