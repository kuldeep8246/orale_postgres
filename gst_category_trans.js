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
 
function setGSTCategoryTrans(){
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
            "SELECT distinct legal_entity,bu_code,a.org_id,bu_desc,tax_category_name"
            +"from  apps.jai_tax_categories_v a, apps.jai_tax_category_lines_v b , tl_apps.xxtmx_le_bu_mapping d"
            +"where a.org_ID=d.org_id and  a.TAX_CATEGORY_ID=b.TAX_CATEGORY_ID"
            +"and b.REGIME_NAME='GST-India' and A.EFFECTIVE_TO is null ORDER by a.org_id,tax_category_name"
            ,
           
            function (err, result) {
 
                if (err) { console.log("oracle ki error->"+err); return; }
 
                valu = result.rows;
 
                var i;
                console.log("table size = " + valu.length);
                emptyGSTCotegoryTemp();
                for (i = 0; i < valu.length; i++) {
                    sr_no = i + 1;
 
                    var GstQueryString = "insert into gst_category_temp(s_no, distinct legal_entity,bu_code,a.org_id,bu_desc,tax_category_name)"
                        + "values (" + sr_no + ",'" + valu[i][0] + "','" + valu[i][1] + "','"+ valu[i][2] + "','"+ valu[i][3] + "','"+ valu[i][4] + "')";
                    pool.query(
                        GstQueryString,
                        (err, res) => {
                            if(err){
                                console.log("location_temp Error-->"+err);
                            }
                        }
 
                    );
                }
                console.log("value inserted in gst_category_temp");
 
                //now comparing bu_trans data with gst_category_temp
                var GstCatTransQuery = "insert into gst_category_trans(s_no, distinct legal_entity,bu_code,a.org_id,bu_desc,tax_category_name)"
                    + "select s_no, distinct legal_entity,bu_code,a.org_id,bu_desc,tax_category_name from gst_category_temp EXCEPT (select s_no,distinct legal_entity,bu_code,a.org_id,bu_desc,tax_category_name from gst_category_trans)";
                pool.query(
                    GstCatTransQuery,
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
 
function emptyGSTCotegoryTemp() {
    pool.query('DELETE FROM gst_category_temp', (error, results) => {
        if (error) {
            throw error
        }
        console.log("gst_category_temp table cleared");
    })
}
 
module.exports={setGSTCategoryTrans:setGSTCategoryTrans()}