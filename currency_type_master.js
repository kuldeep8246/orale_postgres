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
 
function setGlCurrTrans(){
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
            "select CURRENCY_CODE,CURRENCY_DESC"
            +"from GL_CURR_MST ORDER BY 1"
            ,
 
            function (err, result) {
 
                if (err) { console.log("oracle ki error->"+err); return; }
 
                valu = result.rows;
 
                var i;
                console.log("table size = " + valu.length);
                emptyGlCurrTemp();
                for (i = 0; i < valu.length; i++) {
                    sr_no = i + 1;
 
                    var buQueryString = "insert into gl_curr_temp(s_no, CURRENCY_CODE, CURRENCY_DESC)"
                        + "values (" + sr_no + ",'" + valu[i][0] + "','" + valu[i][1] + "')";
                    pool.query(
                        buQueryString,
                        (err, res) => {
                            if(err){
                                console.log("gl_curr_temp Error-->"+err);
                            }
                        }
 
                    );
                }
                console.log("value inserted in gl_curr_temp");
 
                //now comparing bu_trans data with gl_curr_temp
                var GlCurrTransQuery = "insert into gl_curr_trans(s_no, CURRENCY_CODE, CURRENCY_DESC)"
                    + "select s_no, CURRENCY_CODE, CURRENCY_DESC from gl_curr_temp EXCEPT (select s_no, CURRENCY_CODE, CURRENCY_DESC from gl_curr_trans)";
                pool.query(
                    GlCurrTransQuery,
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
 
function emptyGlCurrTemp() {
    pool.query('DELETE FROM gl_curr_temp', (error, results) => {
        if (error) {
            throw error
        }
        console.log("gl_curr_temp table cleared");
    })
}
 
module.exports={setGlCurrTrans:setGlCurrTrans()}