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
 
function setLocationTrans(){
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
            "select select flex_value LOCATION_CODE, DESCRIPTION LOCATION_DESC"
            +"from fnd_flex_values_vl"
            +"where flex_value_set_id= 1007923 and nvl(enabled_flag,'N') ='Y' and NVL(summary_flag,'N')='N' and end_date_active is null order by flex_value"
            ,
           
            function (err, result) {
 
                if (err) { console.log("oracle ki error->"+err); return; }
 
                valu = result.rows;
 
                var i;
                console.log("table size = " + valu.length);
                emptyLocationTemp();
                for (i = 0; i < valu.length; i++) {
                    sr_no = i + 1;
 
                    var locationQueryString = "insert into location_temp(s_no, flex_value LOCATION_CODE, DESCRIPTION LOCATION_DESC)"
                        + "values (" + sr_no + ",'" + valu[i][0] + "','" + valu[i][1] + "')";
                    pool.query(
                        locationQueryString,
                        (err, res) => {
                            if(err){
                                console.log("location_temp Error-->"+err);
                            }
                        }
 
                    );
                }
                console.log("value inserted in location_temp");
 
                //now comparing bu_trans data with location_temp
                var LocationTransQuery = "insert into location_trans(s_no, flex_value LOCATION_CODE, DESCRIPTION LOCATION_DESC)"
                    + "select s_no, flex_value LOCATION_CODE, DESCRIPTION LOCATION_DESC from location_temp EXCEPT (select s_no, flex_value LOCATION_CODE, DESCRIPTION LOCATION_DESC from location_trans)";
                pool.query(
                    LocationTransQuery,
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
 
function emptyLocationTemp() {
    pool.query('DELETE FROM location_temp', (error, results) => {
        if (error) {
            throw error
        }
        console.log("location_temp table cleared");
    })
}
 
module.exports={setLocationTrans:setLocationTrans()}