import React from 'react';
import CommonLayout from '../components/layout/common-layout';
import { Row, Container } from 'reactstrap';
import Banner from "./layouts/Agri/components/Banner";
import { getBanner } from '../helpers/lib';

const Privacy = ({banner}) => {

    return (
        <CommonLayout title="collection" parent="home" sidebar={false}>
            <Banner 
                banner={banner}
            />
            <section className="section-b-space about-section">
                <Container>
                    <h4 className="section-title mb-3">Privacy Policy</h4>
                    <div className="p-2">
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Convallis posuere morbi leo urna molestie at. Massa enim nec dui nunc mattis enim ut tellus. Ac tortor vitae purus faucibus ornare suspendisse sed nisi lacus. Ipsum suspendisse ultrices gravida dictum fusce ut placerat orci nulla. Eget nulla facilisi etiam dignissim diam. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo vel. Sit amet justo donec enim diam vulputate ut pharetra sit. Lorem ipsum dolor sit amet consectetur adipiscing. Ut lectus arcu bibendum at varius vel pharetra vel. Fermentum posuere urna nec tincidunt praesent semper. Proin sed libero enim sed faucibus turpis. Ut tellus elementum sagittis vitae et leo duis. Dictum non consectetur a erat nam at.
                        </p>
                        <p>
                            Ornare aenean euismod elementum nisi quis eleifend quam. Mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa. Quis viverra nibh cras pulvinar mattis nunc sed blandit libero. Consectetur libero id faucibus nisl tincidunt. Egestas integer eget aliquet nibh. At tempor commodo ullamcorper a lacus. Nam at lectus urna duis convallis convallis tellus. Feugiat vivamus at augue eget arcu dictum varius duis at. Sit amet commodo nulla facilisi nullam vehicula ipsum a arcu. Vitae semper quis lectus nulla at volutpat diam. Tempus urna et pharetra pharetra. Enim eu turpis egestas pretium. Tempus quam pellentesque nec nam aliquam sem. Tincidunt lobortis feugiat vivamus at augue. Congue eu consequat ac felis donec et odio pellentesque diam. Faucibus scelerisque eleifend donec pretium vulputate sapien. Aliquet porttitor lacus luctus accumsan tortor. Purus semper eget duis at tellus at urna. Adipiscing at in tellus integer feugiat scelerisque. Cras tincidunt lobortis feugiat vivamus at augue eget arcu dictum.
                        </p>
                        <p>
                            Porta nibh venenatis cras sed felis eget velit. Leo vel orci porta non pulvinar neque laoreet suspendisse. Adipiscing enim eu turpis egestas pretium aenean. Hac habitasse platea dictumst vestibulum rhoncus. Eu ultrices vitae auctor eu augue ut lectus. Eleifend donec pretium vulputate sapien. Donec ac odio tempor orci dapibus ultrices. Tincidunt tortor aliquam nulla facilisi cras. Lacus laoreet non curabitur gravida. Cursus metus aliquam eleifend mi in nulla posuere sollicitudin aliquam. Faucibus pulvinar elementum integer enim neque volutpat ac. Scelerisque in dictum non consectetur a erat. Ut diam quam nulla porttitor massa id neque aliquam vestibulum.
                        </p>
                        <p>
                            Aliquam ut porttitor leo a diam sollicitudin tempor. Ornare lectus sit amet est. Vestibulum rhoncus est pellentesque elit ullamcorper. Odio pellentesque diam volutpat commodo sed egestas egestas. At in tellus integer feugiat scelerisque varius morbi enim nunc. In ante metus dictum at tempor. Nullam non nisi est sit amet. Magna fermentum iaculis eu non diam phasellus vestibulum. Odio aenean sed adipiscing diam donec. Tellus integer feugiat scelerisque varius morbi enim nunc faucibus. Arcu ac tortor dignissim convallis aenean et tortor. Sed vulputate odio ut enim blandit volutpat maecenas volutpat. Adipiscing vitae proin sagittis nisl rhoncus. Risus quis varius quam quisque.
                        </p>
                    </div>
                </Container>
            </section>
        </CommonLayout>
    )
}

export default Privacy;

export async function getStaticProps() {
    const banner = await getBanner()
  
    return {
        props: {
            banner
        },
        revalidate: 60,
    }
}