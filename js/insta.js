document.addEventListener("DOMContentLoaded",()=>{
    async function instaAPI(){
        // 子要素<ul>を追加
        document.querySelector('#insta').insertAdjacentHTML('beforeend','<ul></ul>');  
        
        let cards =  12; // insta投稿の表示件数を指定
        const response = await fetch(`https://graph.facebook.com/v9.0/【ビジネスアカウントID】?fields=name,media.limit(${cards}){ caption,media_url,thumbnail_url,permalink,like_count,comments_count,media_type}&access_token=【アクセストークン】`);
        
        if(response.status === 200){
            const resObjects = await response.json();
            // console.log(resObjects.media);
            //（挙動への影響は一切無いものの）オブジェクト{resObjects.media}内のプロパティ{paging}のせいで「instaItems[1]が無いというエラー」が出るので削除して以降の処理を進めていく 
            delete(resObjects.media.paging);

            Object.entries(resObjects.media).forEach(instaItems => {
                // console.log(instaItems);
                instaItems[1].forEach(eachItem => {
                    if(eachItem.media_url !== null){
                        // 投稿が動画か否かを判定して{media}を変更
                        if(eachItem.media_type === 'VIDEO'){
                            eachItem.media = eachItem.thumbnail_url;
                        } else {
                            eachItem.media = eachItem.media_url;
                        }

                        const eachItemCaption = eachItem.caption;
                        if(eachItemCaption) {
                            const captions = eachItem.caption.slice(0, 80);
                            const captionTxt = `${captions}……`;
                            
                            // 追加した子要素<ul>に各アイテム<li>を生成
                            document.querySelector('#insta ul').insertAdjacentHTML('beforeend', `<li><a href="${eachItem.permalink}" target="_blank" rel="noopener"><img src="${eachItem.media}"><span class="captionTxt">${captionTxt}</span><span class="like_count">${eachItem.like_count}</span></a></li>`);
                        } else {
                          // 追加した子要素<ul>に各アイテム<li>を生成（<span class="captionTxt">${captionTxt}</span>が無い形）
                          document.querySelector('#insta ul').insertAdjacentHTML('beforeend', `<li><a href="${eachItem.permalink}" target="_blank" rel="noopener"><img src="${eachItem.media}"><span class="like_count">${eachItem.like_count}</span></a></li>`);
                        }
                    }
                });
            });
        } else {
            document.querySelector('#insta ul').insertAdjacentHTML('beforeend',`<p style="text-align:center;width:100%;">読み込めませんでした</p>`);
        }
    }
    instaAPI(); // 関数の実行
});
