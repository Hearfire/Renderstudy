# HW1
主要是实现Phong光照模型，效果如下
![Phong Material](homework0/result/1.png "hw0 result")
## 要点
- 属性输入（Attributes）从顶点缓冲区或其他途径传来。 统一变量（Uniforms）包含各种不会修改的矩阵。输出变量（Varyings）会自动插值
- 修改fragment shader（位于InternalShader.js）
- 创造Phong Material