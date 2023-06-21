import { useEffect } from "react";
import { countThesisAPI } from "../../service/thesis.service";
import { countStudentAPI } from "../../service/student.service";
import { countTeacherAPI } from "../../service/teacher.service";
import { countUserAPI } from "../../service/user.service";
import { countFacultyAPI } from "../../service/faculty.service";
import { countMajorAPI } from "../../service/major.service";
import { countDocumentAPI } from "../../service/document.service";
import { countEvaluationAPI} from "../../service/evaluation.service";
import { useState } from "react";
import { Card, Container, Grid, Typography } from "@mui/material";
import { CenterFocusStrong } from "@mui/icons-material";
import { countClassesAPI } from "../../service/classes.service";

export default function SearchStatistic() {
  const [countThesis, setCountThesis] = useState(0);
  const [countUser, setCountUser] = useState(0);
  const [countStudent, setCountStudent] = useState(0);
  const [countTeacher, setCountTeacher] = useState(0);
  const [countFaculty, setCountFaculty] = useState(0);
  const [countMajor, setCountMajor] = useState(0);
  const [countEvaluation, setCountEvaluation] = useState(0);
  const [countDocument, setCountDocument] = useState(0);
  const [countClasses, setCountClasses] = useState(0);

  const getData = async () => {
    let resp = await countThesisAPI();
    let resp1 = await countStudentAPI();
    let resp2 = await countTeacherAPI();
    let resp3 = await countUserAPI();
    let resp4 = await countFacultyAPI();
    let resp5 = await countMajorAPI();
    let resp6 = await countEvaluationAPI();
    let resp7 = await countDocumentAPI();
    let resp8 = await countClassesAPI();

    if (resp.code === 200) setCountThesis(resp.result.data);
    if (resp1.code === 200) setCountStudent(resp1.result.data);
    if (resp2.code === 200) setCountTeacher(resp2.result.data);
    if (resp3.code === 200) setCountUser(resp3.result.data);
    if (resp4.code === 200) setCountFaculty(resp4.result.data);
    if (resp5.code === 200) setCountMajor(resp5.result.data);
    if (resp6.code === 200) setCountEvaluation(resp6.result.data);
    if (resp7.code === 200) setCountDocument(resp7.result.data);
    if (resp8.code === 200) setCountClasses(resp8.result.data);

  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Container style={{minHeight: 480}} >
      <Typography  variant="h4" sx={{ mt: 6 , mb: 2, textAlign: 'center' }}>
        Số liệu thống kê
      </Typography>

      <Grid container spacing={3} style={{marginTop: 10}} >
        <Grid item xs={12} sm={6} md={3} >
          <Card
            style={{
              backgroundColor: '#f542b9',
              textAlign: "center",
              display: "block",
              border: "solid 1px",
            }}
          >
            <Typography>Số lượng đồ án</Typography>
            <br />
            {countThesis}
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            style={{
              backgroundColor: '#f54278',
              textAlign: "center",
              display: "block",
              border: "solid 1px",
            }}
          >
            <Typography>Số lượng người dùng</Typography>
            <br />
            {countUser}
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            style={{
            
              backgroundColor: '#84f542',
              textAlign: "center",
              display: "block",
              border: "solid 1px",
            }}
          >
            <Typography >Số lượng sinh viên</Typography>
            <br />
            {countStudent}
          </Card>{" "}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            style={{
              backgroundColor: 'rgb(200, 250, 205)',
              textAlign: "center",
              display: "block",
              border: "solid 1px",
            }}
          >
            <Typography>Số lượng giảng viên</Typography>
            <br />
            {countTeacher}
          </Card>{" "}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            style={{
              backgroundColor: 'rgb(255, 247, 205)',
              textAlign: "center",
              display: "block",
              border: "solid 1px",
            }}
          >
            <Typography>Số lượng khoa</Typography>
            <br />
            {countFaculty}
          </Card>{" "}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            style={{
              backgroundColor: 'rgb(255, 231, 217)',
              textAlign: "center",
              display: "block",
              border: "solid 1px",
            }}
          >
            <Typography>Số lượng ngành học</Typography>
            <br />
            {countMajor}
          </Card>{" "}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            style={{
              backgroundColor: 'rgb(255, 231, 217)',
              textAlign: "center",
              display: "block",
              border: "solid 1px",
            }}
          >
            <Typography>Số lượng lớp chuyên ngành</Typography>
            <br />
            {countClasses}
          </Card>{" "}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            style={{
              backgroundColor: 'rgb(208, 242, 255)',
              textAlign: "center",
              display: "block",
              border: "solid 1px",
            }}
          >
            <Typography>Số lượng bình luận</Typography>
            <br />
            {countEvaluation}
          </Card>{" "}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            style={{
              backgroundColor: 'rgb(150, 150, 220)',
              textAlign: "center",
              display: "block",
              border: "solid 1px",
            }}
          >
            <Typography>Số lượng tài liệu</Typography>
            <br />
            {countDocument}
          </Card>{" "}
        </Grid>
        <Grid item xs={12} md={12} lg={12}></Grid>
      </Grid>
    </Container>
  );
}
