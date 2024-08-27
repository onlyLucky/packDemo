var srs = {

    // 新推流路径
    srsUrlPath: "webrtc://192.168.90.103/live/live200",

    // srs同屏或者大屏时的内容显示
    streamMedia: {
        // 是否在同屏或者大屏功能中推送成功
        isPush: false,
        // 是否开启新推流功能
        isOpen: false,
    },





    query: parse_query_string(),

    sdk: null,  // Global handler to do cleanup when republishing.

    // 退出视频播放 并且清理缓存
    colse: function () {
        srs.streamMedia.isPush = false;
        // $("#videoShare,.videoShareVideoShare,#srsPushVideo #SRS_Video").hide();
        if (srs.sdk) {
            srs.sdk.close();
        }
    },

    // RTC推流当前画面
    startPublish: function (status, back) {

        // srs_init_rtc("#txt_url", srs.query);

        // $('#videoShare').show();

        if (status) {
            // Close PC when user replay.
            if (srs.sdk) {
                srs.sdk.close();
            }

            if (audioDeviceId == '') {
                var audioData = false
            } else {
                var audioData = {
                    deviceId: audioDeviceId
                }
            }

            var constraints = {
                audio: audioData,
                video: {
                    deviceId: videoDeviceId,
                    width: { ideal: window.screen.width, max: window.screen.width },
                    height: { ideal: window.screen.height, max: window.screen.height },
                }
            };

            srs.sdk = new SrsRtcPublisherAsync(constraints);

            // srs.sdk.constraints = {
            //     audio: {
            //         deviceId: audioDeviceId
            //     },
            //     video:{
            //         deviceId:videoDeviceId,
            //         width: {ideal: window.screen.width, max: window.screen.width},
            //         height: {ideal: window.screen.height, max: window.screen.height},
            //     }
            // };

            // User should set the stream when publish is done, @see https://webrtc.org/getting-started/media-devices
            // However SRS SDK provides a consist API like https://webrtc.org/getting-started/remote-streams
            console.log(srs.sdk)
            // $('#videoShare video').prop('srcObject', srs.sdk.stream);

            // Optional callback, SDK will add track to stream.
            // sdk.ontrack = function (event) { console.log('Got track', event); sdk.stream.addTrack(event.track); };

            // https://developer.mozilla.org/en-US/docs/Web/Media/Formats/WebRTC_codecs#getting_the_supported_codecs
            // srs.sdk.pc.onicegatheringstatechange = function (event) {
            //     if (srs.sdk.pc.iceGatheringState === "complete") {
            //         // $('#acodecs').html(SrsRtcFormatSenders(srs.sdk.pc.getSenders(), "audio"));
            //         // $('#vcodecs').html(SrsRtcFormatSenders(srs.sdk.pc.getSenders(), "video"));
            //     }
            // }
            var url = srs.srsUrlPath + dmData.nodeInfo.liveName
            console.log(url)
            srs.sdk.publish(url).then(function (session) {
                console.log("推流成功")
                srs.streamMedia.isPush = true;
                if (back) {
                    // 回调倒计时
                    setTimeout(function () {
                        back()
                    }, 500)

                }
                // var pamasm={}
                // pamasm.url=url
                // _commSocket.sendTo_Room_Meeting_Nodes_Users_Client_Type("newShareRTC",pamasm , null, dmData.nowMeeting.meetingId, null, null, [dmData.clientType.ELEVATOR,dmData.clientType.PAD],"Allow");
                // $('#sessionid').html(session.sessionid);
                // $('#simulator-drop').attr('href', session.simulator + '?drop=1&username=' + session.sessionid);
            }).catch(function (reason) {
                // Throw by srs.sdk.
                if (reason instanceof SrsError) {
                    if (reason.name === 'HttpsRequiredError') {
                        alert(`WebRTC推流必须是HTTPS或者localhost：${reason.name} ${reason.message}`);
                    } else {
                        alert(`${reason.name} ${reason.message}`);
                    }
                }
                // See https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#exceptions
                if (reason instanceof DOMException) {
                    if (reason.name === 'NotFoundError') {
                        alert(`找不到麦克风和摄像头设备：getUserMedia ${reason.name} ${reason.message}`);
                    } else if (reason.name === 'NotAllowedError') {
                        alert(`你禁止了网页访问摄像头和麦克风：getUserMedia ${reason.name} ${reason.message}`);
                    } else if (['AbortError', 'NotAllowedError', 'NotFoundError', 'NotReadableError', 'OverconstrainedError', 'SecurityError', 'TypeError'].includes(reason.name)) {
                        alert(`getUserMedia ${reason.name} ${reason.message}`);
                    }
                }
                // 推流数据清除对应的内容
                srs.sdk.close();
                // 推流失败
                dm.pBox("推流失败");
                // $('#rtc_media_player').hide();
                console.error(reason);
                // 当是同屏时取消同屏
                if (dmMethod.isShare) {
                    // 取消分享
                    webSocketToShareScreen(false);
                } else if (dmMethod.hasUpBigScreen) { // 当是大屏时取消大屏
                    // 取消上大屏
                    webSocketToBigScreen(false);
                }
            });
        } else {
            if (srs.sdk) {
                srs.sdk.close();
            }
        }


    },


    // RTC视频播放
    startPlay: function (url) {

        try {
            // 最小化所有源文件
            // wiMiniFile();
            // 还原下方文件最小化菜单选中的状态
            // $(".mainBottomFileDivTag").removeClass("beSelected");
        } catch (e) { }

        // $("#txt_url").val(url)

        $('#srsPushVideo #SRS_Video').prop('muted', false);
        // $('#rtc_media_player').show();

        // Close PC when user replay.
        if (srs.sdk) {
            srs.sdk.close();
        }
        srs.sdk = new SrsRtcPlayerAsync();

        // https://webrtc.org/getting-started/remote-streams
        // $('#videoShare video').prop('srcObject', srs.sdk.stream);
        // Optional callback, SDK will add track to stream.
        // sdk.ontrack = function (event) { console.log('Got track', event); sdk.stream.addTrack(event.track); };
        $('#srsPushVideo #SRS_Video').prop('srcObject', srs.sdk.stream);
        // For example: webrtc://r.ossrs.net/live/livestream
        // var url = $("#txt_url").val();
        srs.sdk.play(url).then(function (session) {
            // $('#videoShare,.videoShareVideoShare').css("display", "flex");
            // $('#srsPushVideo #SRS_Video').show();
            setTimeout(function () {
                // $(".videoShareVideoShare").hide();

                $('#srsPushVideo #SRS_Video').prop('srcObject', srs.sdk.stream);
            }, 5000)
            // $('#sessionid').html(session.sessionid);
            // $('#simulator-drop').attr('href', session.simulator + '?drop=1&username=' + session.sessionid);
        }).catch(function (reason) {
            srs.sdk.close();
            // $('#rtc_media_player').hide();
            console.error(reason);
            dm.pBox("播放失败！");

        });
    },

};

var audioDeviceId = ''
var videoDeviceId = ''
try {
    navigator.mediaDevices.enumerateDevices().then((device) => {
        console.log(device)
        device.forEach((item) => {
            if (item.label === 'UScreenCapture' || item.label === 'screen-capture-recorder') {
                videoDeviceId = item.deviceId;
            }
            if (item.label === '立体声混音 (Realtek High Definition Audio)' || item.label === 'Speaker (e2eSoft VAudio)') {
                audioDeviceId = item.deviceId;
            }
        })
        console.info(device);
    })
} catch (e) {

}