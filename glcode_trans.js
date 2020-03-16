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
 
function setGLCodeTrans(){
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
            "select flex_value GL_Code,  description"
            +"from fnd_flex_values_vl where flex_value_set_id =1007925 and nvl(enabled_flag,'N') ='Y' and NVL(summary_flag,'N') ='N'"
            +"and end_date_active is null and substr(flex_value,1,1 ) in ('5','6','7','8')"
            +"order by flex_value"
            ,
            
            function (err, result) {
 
                if (err) { console.log("oracle ki error->"+err); return; }
 
                valu = result.rows;
 
                var i;
                console.log("table size = " + valu.length);
                emptyGSTCotegoryTemp();
                for (i = 0; i < valu.length; i++) {
                    sr_no = i + 1;
 
                    var glCodeQueryString = "insert into glcode_temp(s_no, flex_value GL_Code,  description)"
                        + "values (" + sr_no + ",'" + valu[i][0] + "','" + valu[i][1] + "')";
                    pool.query(
                        glCodeQueryString,
                        (err, res) => {
                            if(err){
                                console.log("glcode_temp Error-->"+err);
                            }
                        }
 
                    );
                }
                console.log("value inserted in glcode_temp");
 
                //now comparing glcode_trans data with glcode_temp
                var glCodeTransQuery = "insert into glcode_trans(s_no, flex_value GL_Code,  description)"
                    + "select s_no, flex_value GL_Code,  description from glcode_temp EXCEPT (select s_no,flex_value GL_Code,  description from glcode_trans)";
                pool.query(
                    glCodeTransQuery,
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
 
function emptyGlCodeTemp() {
    pool.query('DELETE FROM glcode_temp', (error, results) => {
        if (error) {
            throw error
        }
        console.log("glcode_temp table cleared");
    })
}
 
module.exports={setGLCodeTrans:setGLCodeTrans()}