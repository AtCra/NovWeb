# NovWeb
a novel website frontend base on Vue

## 数据存储：Vuex
全局store中存储三种数据：
设置，目录，书籍
1. state.setting
	数据结构：对象
	
2. state.books
	数据结构：数组
	存储所有缓存的books，缓存的Book对象具有下列属性
		path：相对路径
		chapterNum：章节数
		index：当前阅读的章节
		chapters：数组，存放各章节内容
			chapter为一个对象，具有以下属性
			title：章节标题
			context：章节内容
3. state.dirs
	数据结构：数组
	缓存目录结构。每个Dir为一个对象，具有下列属性
	path：相对路径
	childrenDirs
	childrenBooks：该数组存储的Book侧重书的外在信息，每个Book对象具有以下属性
		size：空间大小
		path：相对路径
		lastReadTime：最后阅读时间
