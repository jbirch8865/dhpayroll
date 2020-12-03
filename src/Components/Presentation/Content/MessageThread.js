import { Modal, Button, List, Switch, Input, Row, Col, Alert } from "antd";
import { CloseOutlined, ConsoleSqlOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { CDMapi } from "../../../Utils/api";
import reactJoin from "../../../Utils/reactJoin";
import "./style.css";
function MessageThread(props) {
  const [textMessage, setTextMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);
  const smsMessages = useRef([]);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLogs, setShowLogs] = useState(false);
  const [hideRead, setHideRead] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  function splitArrayIntoChunksOfLen(arr, len) {
    var chunks = [],
      i = 0,
      n = arr.length;
    while (i < n) {
      chunks.push(arr.slice(i, (i += len)));
    }
    return chunks;
  }

  const sendText = () => {
    setSendingMessage(true);
    let count = 0;
      props.selectedRows.map(personnel => 
      CDMapi.post("/employees/"+personnel+"/sms", {
        message: textMessage,
        from: props.textFromNumber,
      }).then(() => {
        if(++count === props.selectedRows.length)
        {
          setMessageHistory([]);
          smsMessages.current = [];
          setCurrentPage(0)
          setTimeout(() => setCurrentPage(1), 100);
          setSendingMessage(false);  
        }
      }))
  };
  const toggleReadText = (sid, dh_read) => {
    CDMapi.put("sms", { sid, dh_read }).then(() => {
      setMessageHistory([]);
      smsMessages.current = [];
      getHistory();
    });
  };
  const getHistory = () => {
    setLoadingHistory(true);
    splitArrayIntoChunksOfLen(props.selectedRows, 250).map((chunk) => {
      CDMapi.get("/employees/sms", {
        params: {
          page: currentPage,
          from: props.textFromNumber,
          people: chunk,
          paginate: 20,
        },
      })
        .then((response) => {
          smsMessages.current = [
            ...smsMessages.current,
            ...response.data.received.data,
            ...response.data.sent.data,
          ];
          setMessageHistory(
            [...smsMessages.current].sort((a, b) => {
              a = new Date(a.timestamp);
              b = new Date(b.timestamp);
              return a > b ? -1 : a < b ? 1 : 0;
            })
          );
          setLoadingHistory(false);
        })
        .catch((error) => {
          setLoadingHistory(false);
        });
    });
  };

  const removePerson = (key) => {
    props.setSelectedRows(props.selectedRows.filter((keys) => keys !== key));
    setMessageHistory([]);
    smsMessages.current = [];
    setTimeout(() => setCurrentPage(1), 100);
  };
  useEffect(() => {
    props.viewMessageThread === true && getHistory();
    if (props.viewMessageThread === false) {
      setMessageHistory([]);
      smsMessages.current = [];
      setCurrentPage(1);
    }
  }, [props.viewMessageThread, currentPage,props.selectedRows]);

  return (
    <Modal
      visible={props.viewMessageThread}
      title="SMS History - Announcements"
      width={1050}
      footer={null}
      centered
      destroyOnClose={true}
      onOk={() => {
        setTextMessage("");
        props.setViewMessageThread(false);
      }}
      onCancel={() => {
        setTextMessage("");
        props.setViewMessageThread(false);
      }}
    >
      Show Logs:
      <Switch checked={showLogs} onChange={setShowLogs} /> Hide Read:
      <Switch checked={hideRead} onChange={setHideRead} />
      <Row>
        <Col span={20}>
          <List
            itemLayout="horizontal"
            dataSource={messageHistory}
            bordered={true}
            loading={loadingHistory}
            loadMore={
              <Button onClick={() => setCurrentPage(currentPage + 1)}>
                Load More Texts
              </Button>
            }
            style={{ height: "55vh", overflow: "auto" }}
            renderItem={(item) => {
              const logComment =
                typeof item.message_body !== "undefined"
                  ? item.message_body.includes(
                      "This is a log of the event, this is not a message that was actually sent to the individual."
                    )
                  : false;
              return (
                <>
                  {typeof item.message_body !== "undefined" &&
                    (item.dh_read === 0 || !hideRead) &&
                    (!logComment || showLogs) && (
                      <List.Item>
                        {!item.received && (
                          <div style={{ width: "100%" }}>
                            <div
                              style={{ width: "fit-content", float: "right" }}
                            >
                              <p
                                onClick={() =>
                                  toggleReadText(item.twilio_sid, !item.dh_read)
                                }
                                className={
                                  item.dh_read == false
                                    ? "smsMessageContent smsMessageResponse smsMessageUnread smsMessageResponseUnread"
                                    : "smsMessageContent smsMessageResponse"
                                }
                              >
                                {item.message_body}
                              </p>
                              <p>
                                {item.person_name} - {item.timestamp}
                              </p>
                            </div>
                          </div>
                        )}
                        {item.received && (
                          <div style={{ marginLeft: "0px" }}>
                            <p>
                              {item.username} <br /> {item.timestamp}
                              <br />
                            </p>
                            <p
                              className="smsMessageContent smsMessageSent"
                            >
                              {!logComment && (
                                <>
                                  {item.person_name + ","}
                                  <br />
                                </>
                              )}
                              {item.message_body}
                            </p>
                          </div>
                        )}
                      </List.Item>
                    )}
                </>
              );
            }}
          />
          <br />
        </Col>
        <Col span={4}>
          <Alert
            style={{ height: "30vh", overflow: "auto" }}
            message={reactJoin(
              props.selectedRows,
              (item, index) => (
                <div
                  style={{
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "15px",
                  }}
                >
                  {props.selectedRows.length > 1 && (
                    <CloseOutlined
                      onClick={() => removePerson(item)}
                      style={{
                        display: "inline-block",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                  {typeof props.data.filter((person) => person.key === item)[0] !== "undefined" && props.data.filter((person) => person.key === item)[0].first_name +
                    " " +
                    props.data.filter((person) => person.key === item)[0]
                      .last_name}
                </div>
              ),
              () => (
                <br />
              )
            )}
            type="warning"
          />
        </Col>
      </Row>
      Reply:
      <Input.TextArea
        onChange={(e) => {
          e.persist();
          setTextMessage(e.target.value);
        }}
        value={textMessage}
        rows={4}
      />
      <Button
        htmlType="submit"
        loading={sendingMessage}
        onClick={() => {
          sendText();
          setTextMessage("");
        }}
        type="primary"
      >
        Add Comment
      </Button>
    </Modal>
  );
}

const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps)(MessageThread);
