const Pool = require('pg').Pool
 
const pool = new Pool({
 
    user: 'postgres',
 
    host: '10.200.21.26',
 
    database: 'thrmx',
 
    password: 'system123#',
 
    port: 5432,
 
});
 

 
var oracledb = require('oracledb');
 
var valu = '';
 
var sr_no = "";
 
function setBuTrans(){
oracledb.getConnection(
 
    {
        user: "apps",//saurav
        host: '10.100.1.232',
 
        password: "r12uatapps",//saurav
 
        connectString: "R12UAT",//orc
        port: 1601,
 
 
    },
 
    function (err, connection) {
 
        if (err) { console.log("connection error"+err); return; }
 
        connection.execute(
            "select legal_entity,bu_code,org_id,bu_desc "
            +"from tl_apps.xxtmx_le_bu_mapping a order by sr_no"
            ,
 
            function (err, result) {
 
                if (err) { console.log("oracle ki error->"+err); return; }
 
                valu = result.rows;
 
                var i;
                console.log("table size = " + valu.length);
                emptyBuTemp();
                for (i = 0; i < valu.length; i++) {
                    sr_no = i + 1;
 
                    var buQueryString = "insert into bu_temp(s_no, legal_entity, bu_code, org_id, bu_desc)"
                        + "values (" + sr_no + ",'" + valu[i][0] + "','" + valu[i][1] + "','" + valu[i][2] + "','" + valu[i][3] + "')";
                    pool.query(
                        buQueryString,
                        (err, res) => {
                            if(err){
                                console.log("Temp Error-->"+err);
                            }
                        }
 
                    );
                }
                console.log("value inserted in bu_temp");
 
                //now comparing bu_trans data with bu_temp
                var buTransQuery = "insert into bu_trans(s_no, legal_entity, bu_code, org_id, bu_desc)"
                    + "select s_no, legal_entity, bu_code, org_id, bu_desc from bu_temp EXCEPT (select s_no, legal_entity, bu_code, org_id, bu_desc from bu_trans)";
                pool.query(
                    buTransQuery,
                    (err, res) => {
                        if(err){
                            console.log("Trans Error-->" + err);
                        }
                       // console.log(JSON.res);
                    }
 
                );
 
            });
 
 
    });
}
 
function emptyBuTemp() {
    pool.query('DELETE FROM bu_temp', (error, results) => {
        if (error) {
            throw error
        }
        console.log("bu_temp table cleared");
    })
}
 
module.exports={setBuTrans:setBuTrans()}