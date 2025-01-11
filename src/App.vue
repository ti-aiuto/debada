<template>
  <div>
    <main class="screen">
      <RouterView />
    </main>

    <div class="m-plus-rounded-1c-regular bug-message">
      バグ報告・新たな用語や文章の追加の等の提案は<a
        href="https://docs.google.com/forms/d/e/1FAIpQLSeSoh16hl58ROD5Mi7hSNwd94c29gcrk7F8Q1BgNHsDYTjwsA/viewform?usp=sf_link"
        target="_blank">こちら</a>から<br>
      ちなみに<a href="https://github.com/ti-aiuto/debada/tree/main/src" target="_blank">こちら</a>からソースコードが見れます
    </div>
  </div>
</template>

<style scoped>
.screen {
  border: 2px solid #000;
  width: 640px;
  height: 480px;
  margin: auto;
  position: relative;
}

.bug-message {
  margin: 32px;
  font-size: 12px;
  text-align: center;
  color: #aaa;
}

.bug-message a {
  color: #aaa;
}
</style>
